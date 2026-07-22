import app, { initializeDatabase, initializeRedis, gracefulShutdown } from './app.js';
import config from './config/index.js';
import logger from './config/logger.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import db from './models/index.js';

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });

  // Join business room for multi-tenant isolation
  socket.on('join:business', (businessId) => {
    socket.join(`business:${businessId}`);
    logger.info(`Socket ${socket.id} joined business room: ${businessId}`);
  });

  // Join branch room
  socket.on('join:branch', (branchId) => {
    socket.join(`branch:${branchId}`);
    logger.info(`Socket ${socket.id} joined branch room: ${branchId}`);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Initialize models with associations
    await db.initModels();
    logger.info('Models initialized with associations');

    // Sync database (development only) - Disabled, use migrations instead
    // if (config.env === 'development') {
    //   await db.sequelize.sync({ alter: false });
    //   logger.info('Database synced');
    // }

    // Initialize Redis (optional)
    try {
      await initializeRedis();
    } catch (error) {
      logger.warn('Continuing without Redis cache');
    }

    // Start listening
    server.listen(config.port, () => {
      logger.info('===============================================');
      logger.info('  GroceryOS Backend API Server');
      logger.info('===============================================');
      logger.info(`  Environment: ${config.env}`);
      logger.info(`  Port: ${config.port}`);
      logger.info(`  API Version: ${config.apiVersion}`);
      logger.info(`  Server: http://localhost:${config.port}`);
      logger.info(`  API Docs: http://localhost:${config.port}/api-docs`);
      logger.info(`  Health: http://localhost:${config.port}/health`);
      logger.info(`  Database: Connected`);
      logger.info(`  Redis: ${config.redis.host ? 'Connected' : 'Not configured'}`);
      logger.info('===============================================');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Start the server
startServer();

export default server;
