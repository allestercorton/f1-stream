import session from 'express-session';
import MongoStore from 'connect-mongo';
import env from '../config/env.js';

export const sessionMiddleware = session({
  secret: env.session.secret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: env.mongo.uri,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: env.session.cookie.maxAge,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});
