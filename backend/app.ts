import 'dotenv/config';
import './config/passport.js';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import env from './config/env.js';
import errorHandler from './middleware/error.middleware.js';
import { sessionMiddleware } from './middleware/session.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

// initialize express application
const app = express();

// set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.client.url || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

// add custom session middleware and passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);

// health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// error handling middleware
app.use(errorHandler);

export default app;
