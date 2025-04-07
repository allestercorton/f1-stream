import { createServer } from 'http';
import env from './config/env.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import app from './app.js';
import { chatHandler } from './socket/socket.chat.js';

// connect to the database with error handling
connectDB().catch((err) => {
  logger.error('database connection failed:', err);
  process.exit(1);
});

// create http server instance
const httpServer = createServer(app);

// initialize socket.io
const io = chatHandler();
io.attach(httpServer);

// start the server
httpServer.listen(env.server.port, () => {
  logger.info(
    `🚀 server running in ${env.server.mode} mode on port ${env.server.port}`
  );
});

// handle promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('unhandled rejection:', err);
});

// handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('uncaught exception:', err);
  process.exit(1);
});
