import 'dotenv/config';
import { Env } from '../types/env.types.js';

const env: Env = {
  server: {
    mode: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 5000),
  },
  client: {
    url: process.env.CLIENT_URL ?? 'http://localhost:5173',
  },
  mongo: {
    uri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/myapp',
  },
  token: {
    jwt_secret: process.env.SESSION_SECRET ?? 'dev-secret',
  },
  email: {
    service: process.env.EMAIL_SERVICE ?? 'email-service',
    from: process.env.EMAIL_FROM ?? 'email-from',
    username: process.env.EMAIL_USERNAME ?? 'email-username',
    password: process.env.EMAIL_PASSWORD ?? 'email-password',
  },
};

export default env;
