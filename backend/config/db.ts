import logger from '../utils/logger';
import { connect } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      logger.error('❌ MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    await connect(MONGO_URI);
    logger.info('✅ MongoDB Connected');
  } catch (error) {
    logger.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
