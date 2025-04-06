import type { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { Types } from 'mongoose';
import MessageModel from '../models/message.model.js';

export const getMessages: RequestHandler = asyncHandler(async (req, res) => {
  const limit = Number.parseInt(req.query.limit as string) || 50;

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
    .limit(limit)
    .lean();

  res.json(messages.reverse());
});

export const createMessage: RequestHandler = asyncHandler(async (req, res) => {
  const { text, replyTo } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new createHttpError.BadRequest('Message text is required');
  }

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  const messageData: {
    text: string;
    user: Types.ObjectId;
    replyTo?: Types.ObjectId;
  } = {
    text,
    user: req.user._id,
  };

  if (replyTo) {
    // Validate that replyTo is a valid ObjectId
    if (!Types.ObjectId.isValid(replyTo)) {
      throw new createHttpError.BadRequest('Invalid replyTo ID');
    }

    // Check if the referenced message exists
    const replyToMessage = await MessageModel.findById(replyTo);
    if (!replyToMessage) {
      throw new createHttpError.NotFound('Referenced message not found');
    }

    messageData.replyTo = new Types.ObjectId(replyTo);
  }

  const message = await MessageModel.create(messageData);
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

  res.status(201).json(populatedMessage);
});

export const editMessage: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new createHttpError.BadRequest('Message text is required');
  }

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  // Find the message
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new createHttpError.NotFound('Message not found');
  }

  // Check if the user is the author of the message
  if (message.user.toString() !== req.user._id.toString()) {
    throw new createHttpError.Forbidden('You can only edit your own messages');
  }

  // Store original text if this is the first edit
  if (!message.originalText) {
    message.originalText = message.text;
  }

  message.text = text;
  message.editedAt = new Date();

  await message.save();

  const updatedMessage = await MessageModel.findById(id)
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

  res.json(updatedMessage);
});

export const deleteMessage: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  // Find the message
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new createHttpError.NotFound('Message not found');
  }

  // Check if the user is the author of the message
  if (message.user.toString() !== req.user._id.toString()) {
    throw new createHttpError.Forbidden(
      'You can only delete your own messages'
    );
  }

  // Soft delete
  message.isDeleted = true;
  await message.save();

  res.status(200).json({ message: 'Message deleted successfully' });
});

export const addReply: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new createHttpError.BadRequest('Reply text is required');
  }

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  // Find the message
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new createHttpError.NotFound('Message not found');
  }

  // Add the reply
  message.replies = message.replies || [];
  message.replies.push({
    messageId: id,
    text,
    user: req.user._id,
    createdAt: new Date(),
  });

  await message.save();

  const updatedMessage = await MessageModel.findById(id)
    .populate('user')
    .populate({
      path: 'replies.user',
      model: 'User',
    })
    .lean();

  res.status(201).json(updatedMessage);
});

export const editReply: RequestHandler = asyncHandler(async (req, res) => {
  const { id, replyId } = req.params;
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new createHttpError.BadRequest('Reply text is required');
  }

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  // Find the message
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new createHttpError.NotFound('Message not found');
  }

  // Find the reply
  if (!message.replies || message.replies.length === 0) {
    throw new createHttpError.NotFound('Reply not found');
  }

  const replyIndex = message.replies.findIndex(
    (reply) => reply._id?.toString() === replyId
  );

  if (replyIndex === -1) {
    throw new createHttpError.NotFound('Reply not found');
  }

  const reply = message.replies[replyIndex];

  // Check if the user is the author of the reply
  if (reply.user.toString() !== req.user._id.toString()) {
    throw new createHttpError.Forbidden('You can only edit your own replies');
  }

  // Store original text if this is the first edit
  if (!reply.originalText) {
    reply.originalText = reply.text;
  }

  reply.text = text;
  reply.editedAt = new Date();

  await message.save();

  const updatedMessage = await MessageModel.findById(id)
    .populate('user')
    .populate({
      path: 'replies.user',
      model: 'User',
    })
    .lean();

  res.json(updatedMessage);
});

export const deleteReply: RequestHandler = asyncHandler(async (req, res) => {
  const { id, replyId } = req.params;

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  // Find the message
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new createHttpError.NotFound('Message not found');
  }

  // Find the reply
  if (!message.replies || message.replies.length === 0) {
    throw new createHttpError.NotFound('Reply not found');
  }

  const replyIndex = message.replies.findIndex(
    (reply) => reply._id?.toString() === replyId
  );

  if (replyIndex === -1) {
    throw new createHttpError.NotFound('Reply not found');
  }

  const reply = message.replies[replyIndex];

  // Check if the user is the author of the reply
  if (reply.user.toString() !== req.user._id.toString()) {
    throw new createHttpError.Forbidden('You can only delete your own replies');
  }

  // Soft delete
  reply.isDeleted = true;

  await message.save();

  const updatedMessage = await MessageModel.findById(id)
    .populate('user')
    .populate({
      path: 'replies.user',
      model: 'User',
    })
    .lean();

  res.json(updatedMessage);
});

export const addReaction: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;

  if (!reaction) {
    throw new createHttpError.BadRequest('Reaction type is required');
  }

  if (!req.user) {
    throw new createHttpError.Unauthorized('User must be authenticated');
  }

  // Find the message
  const message = await MessageModel.findById(id);
  if (!message) {
    throw new createHttpError.NotFound('Message not found');
  }

  // Initialize reactions array if it doesn't exist
  message.reactions = message.reactions || [];

  // Check if user already reacted with this reaction
  const existingReactionIndex = message.reactions.findIndex(
    (r) => r.user.toString() === req.user?._id.toString() && r.type === reaction
  );

  if (existingReactionIndex !== -1) {
    // Remove existing reaction (toggle off)
    message.reactions.splice(existingReactionIndex, 1);
  } else {
    // Remove any existing reaction from this user
    const userReactionIndex = message.reactions.findIndex(
      (r) => r.user.toString() === req.user?._id.toString()
    );

    if (userReactionIndex !== -1) {
      message.reactions.splice(userReactionIndex, 1);
    }

    // Add new reaction
    message.reactions.push({
      type: reaction,
      user: req.user._id,
    });
  }

  await message.save();

  const updatedMessage = await MessageModel.findById(id)
    .populate('user')
    .populate({
      path: 'reactions.user',
      model: 'User',
    })
    .lean();

  res.json(updatedMessage);
});
