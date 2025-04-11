import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import createHttpError from 'http-errors';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import env from '../config/env.js';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  // Default error response
  const response: ErrorResponse = {
    success: false,
    message: 'Server Error',
  };

  let statusCode = 500;

  // Handle different error types
  if (createHttpError.isHttpError(err)) {
    statusCode = err.statusCode;
    response.message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    response.message = 'Validation Error';
    response.errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    response.message = 'Validation Error';
    response.errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (isDuplicateKeyError(err)) {
    statusCode = 409;
    response.message = 'Duplicate field value';
    response.errors = [
      {
        field: Object.keys(err.keyValue)[0],
        message: `${Object.keys(err.keyValue)[0]} already exists`,
      },
    ];
  } else if (err instanceof Error) {
    response.message = err.message;
  }

  // Include stack trace in development
  if (env.server.mode === 'development' && err instanceof Error) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Type guard for MongoDB duplicate key error
function isDuplicateKeyError(
  err: unknown
): err is { code: number; keyValue: Record<string, unknown> } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as any).code === 11000
  );
}

export default errorHandler;
