import { connect } from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;
