import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { initializeSocket } from './socket.js';
import logger from './utils/logger.js';

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
server.listen(PORT, () =>
  logger.info(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`)
);
