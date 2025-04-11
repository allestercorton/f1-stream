import jwt, { type JwtPayload } from 'jsonwebtoken';
import env from '../config/env.js';

// Function to retrieve the JWT secret from environment variables
const getJwtSecret = (): string => {
  const JWT_SECRET = env.token.jwt_secret;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined.');
  }
  return JWT_SECRET;
};

// Generate a JWT token
export const generateToken = (payload: string | object | Buffer): string => {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: '30d' });
};

// Verify a JWT token
export const verifyToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error(`Invalid token: ${error}`);
  }
};
