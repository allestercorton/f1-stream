import 'dotenv/config';
import connectDB from './config/db';
import app, { NODE_ENV } from './app';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server is running in ${NODE_ENV} mode at http://localhost:${PORT}`
    );
  });
});
