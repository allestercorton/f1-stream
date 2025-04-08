import 'dotenv/config';
import { Env } from '../types/env.types.js';

// Helper function to check if the environment variable exists
const getEnvVar = (key: string, defaultValue: string = '') => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
};

const env: Env = {
  server: {
    mode: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    url: getEnvVar('SERVER_URL', 'http://localhost:5000'),
  },
  client: {
    url: getEnvVar('CLIENT_URL', 'http://localhost:5173'),
  },
  mongo: {
    uri: getEnvVar('MONGO_URI'),
  },
  google: {
    clientID: getEnvVar('GOOGLE_CLIENT_ID'),
    clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  },
  session: {
    secret: getEnvVar('SESSION_SECRET'),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },
};

export default env;
