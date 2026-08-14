import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';
import config from './config/index.js';
import logger from './config/logger.js';
import db from './models/index.js';
import redisClient from './config/redis.js';
import { errorConverter, errorHandler, notFound } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput, validateHeaders, checkPayloadSize } from './middleware/sanitization.js';

// Import routes
import routes from './routes/index.js';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware - Enhanced helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true,
}));

// Validate request headers for malicious content
app.use(validateHeaders);

// Check payload size before parsing
app.use(checkPayloadSize(10 * 1024 * 1024)); // 10MB limit

// Dynamic CORS configuration supporting local network (LAN) access
const getCorsOrigin = () => {
  const allowed = config.cors.origin;
  if (!allowed || allowed === '*') {
    return true; // Allow all origins if '*' or not restricted
  }
  
  const originsList = typeof allowed === 'string' 
    ? allowed.split(',').map(o => o.trim()) 
    : Array.isArray(allowed) ? allowed : [allowed];

  return (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (originsList.includes('*') || originsList.includes(origin)) {
      return callback(null, true);
    }
    // Allow local network IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x) and localhost
    const isLocalNetwork = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
    if (isLocalNetwork) {
      return callback(null, true);
    }
    logger.warn(`CORS blocked request from origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  };
};

app.use(
  cors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
    maxAge: 600, // 10 minutes
  })
);

// Body parser with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Verify JSON payload is valid
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON payload');
    }
  }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// HTTP request logger
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// Rate limiting
app.use(generalLimiter);

// Input sanitization - Applied to all routes
app.use(sanitizeInput);

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      environment: config.env,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// API routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to GroceryOS API',
    data: {
      version: config.apiVersion,
      documentation: '/api-docs',
      health: '/health',
    },
  });
});

// Mount API routes (support both /api and /api/v1)
app.use('/api', routes);
app.use(`/api/${config.apiVersion}`, routes);

// Swagger documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 handler
app.use(notFound);

// Error converter
app.use(errorConverter);

// Global error handler
app.use(errorHandler);

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    await db.testConnection();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

// Initialize Redis connection
export const initializeRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.warn('Redis connection failed. Running without cache:', error.message);
  }
};

// Graceful shutdown
export const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    // Close Redis connection
    await redisClient.disconnect();

    // Close database connection
    await db.sequelize.close();

    logger.info('All connections closed. Exiting...');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

export default app;
