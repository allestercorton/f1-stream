import { Request } from 'express';
import { Document } from 'mongoose';

export interface UserDocument extends Omit<Document, 'id'> {
  email: string;
  name: string;
  password: string;
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: UserDocument;
}
