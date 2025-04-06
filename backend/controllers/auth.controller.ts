import asyncHandler from 'express-async-handler';
import createError from 'http-errors';
import passport from 'passport';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export const googleAuth = asyncHandler((req, res, next) => {
  logger.info('Google auth route hit');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

export const googleAuthCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: `${env.client.url}/login`,
    session: true,
  })(req, res, (err: unknown) => {
    if (err) {
      logger.error('Google auth callback error:', err);
      return next(createError.InternalServerError('Authentication failed'));
    }
    logger.info('Google callback successful');
    res.redirect(`${env.client.url}`);
  });
});

export const authStatus = asyncHandler(async (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});

export const logout = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return next(createError.InternalServerError('Error logging out'));
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});
