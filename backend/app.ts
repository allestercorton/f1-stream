import 'dotenv/config';
import './config/passport';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import errorHandler from './middleware/error.middleware.js';
import env from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.client.url || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

// Session configuration
app.use(
  session({
    secret: env.session.secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: env.mongo.uri }),
    cookie: {
      maxAge: env.session.cookie.maxAge,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);

// healthy checks
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handler middleware
app.use(errorHandler);

// Trust the first proxy
app.set('trust proxy', 1);

export default app;
