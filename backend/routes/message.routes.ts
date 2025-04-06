import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';
import * as messageController from '../controllers/message.controller.js';

const router = Router();

// Public routes
router.get('/', messageController.getMessages);

// Protected routes
router.post('/', isAuthenticated, messageController.createMessage);
router.put('/:id', isAuthenticated, messageController.editMessage);
router.delete('/:id', isAuthenticated, messageController.deleteMessage);
router.post('/:id/replies', isAuthenticated, messageController.addReply);
router.put(
  '/:id/replies/:replyId',
  isAuthenticated,
  messageController.editReply
);
router.delete(
  '/:id/replies/:replyId',
  isAuthenticated,
  messageController.deleteReply
);
router.post('/:id/reactions', isAuthenticated, messageController.addReaction);

export default router;
