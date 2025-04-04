import type {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import createHttpError from 'http-errors';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';

interface MongooseValidationErrorItem {
  path: string;
  message: string;
}

interface DuplicateKeyError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}

interface ValidationError {
  field: string;
  message: string;
}

const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Server Error';
  let errors: ValidationError[] | null = null;

  if (err instanceof createHttpError.HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: (e as MongooseValidationErrorItem).path,
      message: (e as MongooseValidationErrorItem).message,
    }));
  } else if (isDuplicateKeyError(err)) {
    statusCode = 400;
    message = 'Duplicate field value';
    errors = [
      {
        field: Object.keys(err.keyValue)[0],
        message: 'Already exists',
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack:
      process.env.NODE_ENV === 'development' && err instanceof Error
        ? err.stack
        : undefined,
  });
};

function isDuplicateKeyError(err: unknown): err is DuplicateKeyError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as DuplicateKeyError).code === 11000 &&
    'keyValue' in err
  );
}

export default errorHandler;
