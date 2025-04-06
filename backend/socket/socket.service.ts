/* eslint-disable no-undef */
import { Types } from 'mongoose';
import { Server, type Socket } from 'socket.io';
import type http from 'http';
import MessageModel, { type ReactionType } from '../models/message.model.js';
import UserModel from '../models/user.model.js';
import { getSession } from '../middleware/session.middleware.js';
import logger from '../utils/logger.js';

interface TypingUser {
  userId: string;
  displayName: string;
  timestamp: number;
}

export class SocketService {
  private io: Server;
  private typingUsers: Map<string, TypingUser> = new Map();
  private typingCheckInterval: NodeJS.Timeout | null = null;

  constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupSocketHandlers();
    this.startTypingCleanupInterval();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', async (socket: Socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Get user from session
      const session = await getSession(socket.request);
      const user = session?.passport?.user
        ? await UserModel.findById(session.passport.user)
        : null;

      // Join the main chat room
      socket.join('f1-public-chat');

      // Send last 50 messages to the client
      const messages = await MessageModel.find()
        .populate('user')
        .populate({
          path: 'replies.user',
          model: 'User',
        })
        .populate({
          path: 'replyTo',
          populate: {
            path: 'user',
            model: 'User',
          },
        })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      socket.emit('previous-messages', messages.reverse());

      // Handle new message
      socket.on(
        'send-message',
        async (data: { text: string; replyTo?: string }) => {
          if (!user) return;

          try {
            const messageData: {
              text: string;
              user: Types.ObjectId;
              replyTo?: Types.ObjectId;
              replies: any[];
              reactions: any[];
            } = {
              text: data.text,
              user: user._id,
              replies: [],
              reactions: [],
            };

            if (data.replyTo && Types.ObjectId.isValid(data.replyTo)) {
              messageData.replyTo = new Types.ObjectId(data.replyTo);
            }

            const message = new MessageModel(messageData);
            await message.save();

            const populatedMessage = await MessageModel.findById(message._id)
              .populate('user')
              .populate({
                path: 'replyTo',
                populate: {
                  path: 'user',
                  model: 'User',
                },
              })
              .lean();

            this.io.to('f1-public-chat').emit('new-message', populatedMessage);

            // Clear typing indicator when user sends a message
            if (this.typingUsers.has(user._id.toString())) {
              this.typingUsers.delete(user._id.toString());
              this.broadcastTypingUsers();
            }
          } catch (error) {
            logger.error('Error saving message:', error);
          }
        }
      );

      // Handle edit message
      socket.on(
        'edit-message',
        async (data: { messageId: string; text: string }) => {
          if (!user) return;

          try {
            const message = await MessageModel.findById(data.messageId);

            if (!message) return;

            // Verify the user is the message author
            if (message.user.toString() !== user._id.toString()) {
              return;
            }

            // Store original text if this is the first edit
            if (!message.originalText) {
              message.originalText = message.text;
            }

            message.text = data.text;
            message.editedAt = new Date();

            await message.save();

            const updatedMessage = await MessageModel.findById(data.messageId)
              .populate('user')
              .populate({
                path: 'replies.user',
                model: 'User',
              })
              .populate({
                path: 'replyTo',
                populate: {
                  path: 'user',
                  model: 'User',
                },
              })
              .lean();

            this.io
              .to('f1-public-chat')
              .emit('message-updated', updatedMessage);
          } catch (error) {
            logger.error('Error editing message:', error);
          }
        }
      );

      // Handle delete message
      socket.on('delete-message', async (data: { messageId: string }) => {
        if (!user) return;

        try {
          const message = await MessageModel.findById(data.messageId);

          if (!message) return;

          // Verify the user is the message author
          if (message.user.toString() !== user._id.toString()) {
            return;
          }

          message.isDeleted = true;

          await message.save();

          const updatedMessage = await MessageModel.findById(data.messageId)
            .populate('user')
            .populate({
              path: 'replies.user',
              model: 'User',
            })
            .lean();

          this.io.to('f1-public-chat').emit('message-updated', updatedMessage);
        } catch (error) {
          logger.error('Error deleting message:', error);
        }
      });

      // Handle edit reply
      socket.on(
        'edit-reply',
        async (data: {
          messageId: string;
          replyIndex: number;
          text: string;
        }) => {
          if (!user) return;

          try {
            const message = await MessageModel.findById(data.messageId);

            if (
              !message ||
              !message.replies ||
              !message.replies[data.replyIndex]
            )
              return;

            const reply = message.replies[data.replyIndex];

            // Verify the user is the reply author
            if (reply.user.toString() !== user._id.toString()) {
              return;
            }

            // Store original text if this is the first edit
            if (!reply.originalText) {
              reply.originalText = reply.text;
            }

            reply.text = data.text;
            reply.editedAt = new Date();

            await message.save();

            const updatedMessage = await MessageModel.findById(data.messageId)
              .populate('user')
              .populate({
                path: 'replies.user',
                model: 'User',
              })
              .lean();

            this.io
              .to('f1-public-chat')
              .emit('message-updated', updatedMessage);
          } catch (error) {
            logger.error('Error editing reply:', error);
          }
        }
      );

      // Handle delete reply
      socket.on(
        'delete-reply',
        async (data: { messageId: string; replyIndex: number }) => {
          if (!user) return;

          try {
            const message = await MessageModel.findById(data.messageId);

            if (
              !message ||
              !message.replies ||
              !message.replies[data.replyIndex]
            )
              return;

            const reply = message.replies[data.replyIndex];

            // Verify the user is the reply author
            if (reply.user.toString() !== user._id.toString()) {
              return;
            }

            reply.isDeleted = true;

            await message.save();

            const updatedMessage = await MessageModel.findById(data.messageId)
              .populate('user')
              .populate({
                path: 'replies.user',
                model: 'User',
              })
              .lean();

            this.io
              .to('f1-public-chat')
              .emit('message-updated', updatedMessage);
          } catch (error) {
            logger.error('Error deleting reply:', error);
          }
        }
      );

      // Handle typing indicator
      socket.on('typing', () => {
        if (!user) return;

        this.typingUsers.set(user._id.toString(), {
          userId: user._id.toString(),
          displayName: user.displayName,
          timestamp: Date.now(),
        });

        this.broadcastTypingUsers();
      });

      // Handle stop typing
      socket.on('stop-typing', () => {
        if (!user) return;

        if (this.typingUsers.has(user._id.toString())) {
          this.typingUsers.delete(user._id.toString());
          this.broadcastTypingUsers();
        }
      });

      // Handle reactions
      socket.on(
        'add-reaction',
        async (data: { messageId: string; reaction: ReactionType }) => {
          if (!user) return;

          try {
            const message = await MessageModel.findById(data.messageId);
            if (!message) return;

            // Initialize reactions array if it doesn't exist
            message.reactions = message.reactions || [];

            // Check if user already reacted with this reaction
            const existingReactionIndex = message.reactions.findIndex(
              (r) =>
                r.user.toString() === user._id.toString() &&
                r.type === data.reaction
            );

            if (existingReactionIndex !== -1) {
              // Remove existing reaction (toggle off)
              message.reactions.splice(existingReactionIndex, 1);
            } else {
              // Remove any existing reaction from this user
              const userReactionIndex = message.reactions.findIndex(
                (r) => r.user.toString() === user._id.toString()
              );

              if (userReactionIndex !== -1) {
                message.reactions.splice(userReactionIndex, 1);
              }

              // Add new reaction
              message.reactions.push({
                type: data.reaction,
                user: user._id,
              });
            }

            await message.save();

            const updatedMessage = await MessageModel.findById(data.messageId)
              .populate('user')
              .populate({
                path: 'reactions.user',
                model: 'User',
              })
              .lean();

            this.io
              .to('f1-public-chat')
              .emit('message-updated', updatedMessage);
          } catch (error) {
            logger.error('Error adding reaction:', error);
          }
        }
      );

      // Handle reply
      socket.on(
        'add-reply',
        async (data: { messageId: string; text: string }) => {
          if (!user) return;

          try {
            const message = await MessageModel.findById(data.messageId);
            if (!message) return;

            message.replies = message.replies || [];
            message.replies.push({
              messageId: data.messageId,
              text: data.text,
              user: user._id,
              createdAt: new Date(),
            });

            await message.save();

            const updatedMessage = await MessageModel.findById(data.messageId)
              .populate('user')
              .populate({
                path: 'replies.user',
                model: 'User',
              })
              .lean();

            this.io
              .to('f1-public-chat')
              .emit('message-updated', updatedMessage);
          } catch (error) {
            logger.error('Error adding reply:', error);
          }
        }
      );

      // Handle disconnect
      socket.on('disconnect', () => {
        if (user) {
          this.typingUsers.delete(user._id.toString());
          this.broadcastTypingUsers();
        }
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  private broadcastTypingUsers(): void {
    const typingList = Array.from(this.typingUsers.values());
    this.io.to('f1-public-chat').emit('typing-users', typingList);
  }

  private startTypingCleanupInterval(): void {
    // Clean up typing indicators after 3 seconds of inactivity
    this.typingCheckInterval = setInterval(() => {
      const now = Date.now();
      let updated = false;

      for (const [userId, userData] of this.typingUsers.entries()) {
        if (now - userData.timestamp > 3000) {
          this.typingUsers.delete(userId);
          updated = true;
        }
      }

      if (updated) {
        this.broadcastTypingUsers();
      }
    }, 1000);
  }

  public close(): void {
    if (this.typingCheckInterval) {
      clearInterval(this.typingCheckInterval);
    }
    this.io.close();
  }
}
