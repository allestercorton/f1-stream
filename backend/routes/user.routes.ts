import express from 'express';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get user profile
router.get('/profile', isAuthenticated, (req, res) => {
  res.json(req.user);
});

export default router;
