import { connect } from 'mongoose';
import logger from '../utils/logger.js';
import env from './env.js';

const connectDB = async (): Promise<void> => {
  try {
    await connect(env.mongo.uri);
    logger.info('✅ MongoDB Connected');
  } catch (error) {
    logger.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
