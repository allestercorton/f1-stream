import type { Request } from 'express';
import { DocumentType } from '@typegoose/typegoose';
import type { User } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: DocumentType<User>;
}

export interface TokenPayload {
  id: string;
}
