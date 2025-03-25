import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { unauthorized } from '../utils/error.response';
import { verifyToken } from '../utils/token.utils';
import { AuthRequest } from '../types';
import UserModel from '../models/user.model';

export const protect = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer')
      ? authHeader.split(' ')[1]
      : req.cookies?.token;

    if (!token) return next(unauthorized('Not authorized, no token'));

    const decoded = verifyToken(token) as { id: string } | null;
    if (!decoded) return next(unauthorized('Not authorized, token failed'));

    const user = await UserModel.findById(decoded.id).select('-password');
    if (!user) return next(unauthorized('Not authorized, user not found'));

    req.user = user;
    next();
  }
);
