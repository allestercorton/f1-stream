import { Router } from 'express';
import {
  googleAuth,
  googleAuthCallback,
  authStatus,
  logout,
} from '../controllers/auth.controller.js';

const router = Router();

router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/status', authStatus);
router.get('/logout', logout);

export default router;
