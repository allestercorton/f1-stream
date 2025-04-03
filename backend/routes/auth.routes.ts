import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);

export default router;
