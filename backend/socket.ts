import type { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { Types } from 'mongoose';
import UserModel from './models/user.model.js';
import { MessageModel } from './models/message.model.js';
import {
  ChatMessage,
  SocketData,
  TypingUser,
  ClientToServerEvents,
  ServerToClientEvents,
} from './types/socket.types.js';
import logger from './utils/logger.js';

/**
 * Initializes the Socket.IO server and sets up real-time chat functionality.
 *
 * @param httpServer - The HTTP server instance to attach Socket.IO to.
 * @returns The initialized Socket.IO server instance.
 */
export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
    httpServer,
    {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // Allow reconnection within 2 minutes
        skipMiddlewares: false,
      },
    }
  );

  // Map to track users currently typing in the chat
  const typingUsers = new Map<string, TypingUser>();

  /**
   * Middleware to authenticate users using JWT.
   * If no token is provided, the user remains unauthenticated.
   */
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        socket.data.authenticated = false;
        return next();
      }

      const decoded = verifyToken(token);
      const user = await UserModel.findById(decoded.id).select('name');
      if (!user) {
        socket.data.authenticated = false;
        return next(new Error('User not found'));
      }

      socket.data = {
        user: { id: user._id.toString(), name: user.name },
        authenticated: true,
      };
      next();
    } catch (error) {
      logger.error(error);
      socket.data.authenticated = false;
      next();
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    /**
     * Adds the user to the chat room and sends the last 50 messages.
     */
    const joinChatRoom = async () => {
      try {
        socket.join('f1-chat');
        const messages = await MessageModel.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .populate<{
            user: { _id: Types.ObjectId; name: string };
          }>('user', 'name')
          .lean();

        const formattedMessages = messages.reverse().map((msg) => ({
          id: msg._id.toString(),
          user: { id: msg.user._id.toString(), name: msg.user.name },
          content: msg.content,
          timestamp: msg.createdAt,
          isCurrentUser: socket.data.user?.id === msg.user._id.toString(),
        }));

        socket.emit('previousMessages', formattedMessages);
      } catch (error) {
        logger.error('Chat room join error:', error);
        socket.emit('error', 'Failed to join chat');
      }
    };

    /**
     * Handles real-time typing indicators.
     * Broadcasts to others when a user starts or stops typing.
     */
    socket.on('typing', (isTyping: boolean) => {
      if (socket.data.user) {
        if (isTyping) {
          typingUsers.set(socket.id, {
            id: socket.data.user.id,
            name: socket.data.user.name,
          });
        } else {
          typingUsers.delete(socket.id);
        }
        socket
          .to('f1-chat')
          .emit(
            'userTyping',
            socket.data.user.id,
            socket.data.user.name,
            isTyping
          );
      }
    });

    /**
     * Handles sending messages.
     * Ensures valid input and saves messages to the database.
     */
    socket.on(
      'sendMessage',
      async (content: string, callback: (success: boolean) => void) => {
        if (!socket.data.authenticated || !socket.data.user) {
          callback(false);
          return socket.emit('error', 'Authentication required');
        }

        const trimmedContent = content.trim();
        if (!trimmedContent) return callback(false);
        if (trimmedContent.length > 500)
          return socket.emit('error', 'Message too long (max 500 chars)');

        try {
          const newMessage = await MessageModel.create({
            user: new Types.ObjectId(socket.data.user.id),
            content: trimmedContent,
          });

          const populated = await MessageModel.findById(newMessage._id)
            .populate<{
              user: { _id: Types.ObjectId; name: string };
            }>('user', 'name')
            .lean();

          if (!populated?.user) throw new Error('User population failed');

          const messageData: ChatMessage = {
            id: populated._id.toString(),
            user: {
              id: populated.user._id.toString(),
              name: populated.user.name,
            },
            content: populated.content,
            timestamp: populated.createdAt,
            isCurrentUser: true,
          };

          io.to('f1-chat').emit('chatMessage', messageData);
          callback(true);
        } catch (error) {
          logger.error('Message send error:', error);
          callback(false);
          socket.emit('error', 'Failed to send message');
        }
      }
    );

    /**
     * Handles user disconnection.
     * Removes them from the typing list if necessary.
     */
    socket.on('disconnect', (reason) => {
      if (socket.data.user && typingUsers.has(socket.id)) {
        const user = typingUsers.get(socket.id);
        if (user) {
          socket.to('f1-chat').emit('userTyping', user.id, user.name, false);
        }
        typingUsers.delete(socket.id);
      }
      logger.info(`Client disconnected: ${reason}`);
    });

    /**
     * Handles socket errors.
     */
    socket.on('error', (error: Error) => {
      logger.error('Socket error:', error);
    });

    // Execute the function to join the chat room after connection.
    joinChatRoom();
  });

  return io;
};
