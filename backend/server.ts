import http from 'http';
import app from './app';
import connectDB from './config/db';
import { initializeSocket } from './socket';

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
  console.log(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`)
);
