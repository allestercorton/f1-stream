import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import type { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token.js';
import UserModel from '../models/user.model.js';
import type { AuthRequest } from '../types/auth.js';
import logger from '../utils/logger.js';

// Middleware to protect routes
export const protect = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split('')[1];
        const decoded = verifyToken(token);
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
          throw createHttpError(401, 'Unauthorized: User not found');
        }

        req.user = user;
        next();
      } catch (error) {
        logger.error('Error: ', error);
        throw createHttpError(401, 'Unauthorized: Invalid token');
      }
    } else {
      throw createHttpError(401, 'Unauthorized: No token provided');
    }
  }
);
