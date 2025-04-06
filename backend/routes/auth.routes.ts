import { Router } from 'express';
import passport from 'passport';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const router = Router();

// Initiates Google OAuth2 login flow
router.get('/google', (req, res, next) => {
  logger.info('Google auth route hit');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

// Handles the callback from Google after user grants permission
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${env.client.url}/login`,
    session: true,
  }),
  (req, res) => {
    logger.info('Google callback successful');
    res.redirect(`${env.client.url}`);
  }
);

// Check authentication status
router.get('/status', (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;
