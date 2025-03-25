import jwt from 'jsonwebtoken';
import env from '../config/env';
import { UserDocument } from '../types';

export const generateToken = (user: UserDocument): string => {
  return jwt.sign({ id: user._id, email: user.email }, env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
