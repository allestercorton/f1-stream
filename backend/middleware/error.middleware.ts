/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
};

export default errorHandler;
