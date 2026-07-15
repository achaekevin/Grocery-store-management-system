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

// Import routes
import routes from './routes/index.js';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
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

// Mount API routes
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
