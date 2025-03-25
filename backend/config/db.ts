import { connect } from 'mongoose';
import env from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await connect(env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};
