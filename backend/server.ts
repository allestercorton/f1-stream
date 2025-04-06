import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import env from './config/env.js';

// Connect to MongoDB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(env.server.port, () =>
  logger.info(
    `🚀 Server is running in ${env.server.mode} mode on port ${env.server.port}`
  )
);
