import { Server } from 'socket.io';
import MessageModel from '../models/message.model.js';
import env from '@backend/config/env.js';
import logger from '@backend/utils/logger.js';

export const chatHandler = () => {
  // create new socket.io server instance
  const io = new Server({
    cors: {
      origin: env.client.url || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // handle new connections
  io.on('connection', (socket) => {
    logger.info('client connected:', socket.id);

    // fetch initial messages
    socket.on('getMessages', async () => {
      try {
        const messages = await MessageModel.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        socket.emit('messages', messages.reverse());
      } catch (error) {
        logger.error('error fetching messages:', error);
        socket.emit('error', 'failed to load messages');
      }
    });

    // handle new messages
    socket.on('sendMessage', async (msg) => {
      try {
        const newMsg = await MessageModel.create(msg);
        io.emit('newMessage', newMsg);

        // maintain only 50 most recent messages
        const msgsToDelete = await MessageModel.find()
          .sort({ createdAt: -1 })
          .skip(50)
          .select('_id');

        if (msgsToDelete.length) {
          const ids = msgsToDelete.map((m) => m._id);
          await MessageModel.deleteMany({ _id: { $in: ids } });
        }
      } catch (error) {
        logger.error('error sending message:', error);
        socket.emit('error', 'failed to send message');
      }
    });

    // handle disconnections
    socket.on('disconnect', () => {
      logger.info('client disconnected:', socket.id);
    });
  });

  return io;
};
