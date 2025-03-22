import express from 'express';
import morgan from 'morgan';

const app = express();
export const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

export default app;
