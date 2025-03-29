import type { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Server Error';
  let errors: any = null;

  // Handle HTTP errors
  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e: any) => ({
      field: (e as any).path,
      message: (e as any).message,
    }));
  }

  // Handle Mongoose duplicate key errors
  if ((err as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
    errors = [
      {
        field: Object.keys((err as any).keyValue)[0],
        message: 'Already exists',
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
