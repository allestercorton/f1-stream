import 'dotenv/config';
import { Env } from '../types/env.types.js';

const env: Env = {
  server: {
    mode: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    url: process.env.SERVER_URL || 'http://localhost:5000',
  },
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },
  mongo: {
    uri: process.env.MONGO_URI || '',
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  session: {
    secret: process.env.SESSION_SECRET || '',
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  },
};

export default env;
