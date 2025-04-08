import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    return next();
  }
  throw new createHttpError.Unauthorized('User must be authenticated');
};
