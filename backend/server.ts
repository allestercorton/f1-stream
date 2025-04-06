import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import env from './config/env.js';
import { SocketService } from './socket/socket.service.js';

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
new SocketService(server);

// Start server
server.listen(env.server.port, () =>
  logger.info(
    `🚀 Server is running in ${env.server.mode} mode on port ${env.server.port}`
  )
);

function gracefulShutdown() {
  logger.info('Shutdown signal received, shutting down gracefully');

  // Timeout for forced shutdown
  const forceShutdown = setTimeout(() => {
    logger.warn('Forcing shutdown due to timeout');
    process.exit(1);
  }, 5000);

  server.close((err) => {
    if (err) {
      logger.error('Error closing HTTP server:', err);
      process.exit(1);
    }

    logger.info('HTTP server closed');
    mongoose.connection
      .close()
      .then(() => {
        logger.info('MongoDB connection closed');
        clearTimeout(forceShutdown);
        process.exit(0);
      })
      .catch((err) => {
        logger.error('Error closing MongoDB connection:', err);
        clearTimeout(forceShutdown);
        process.exit(1);
      });
  });
}

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown); // For Kubernetes/docker
process.on('SIGINT', gracefulShutdown); // For Ctrl+C in terminal
