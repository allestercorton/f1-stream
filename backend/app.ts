import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import raceRoutes from './routes/race.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/races', raceRoutes);

// healthy checks
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handler middleware
app.use(errorHandler);

// Trust the first proxy
app.set('trust proxy', 1);

export default app;
