import 'dotenv/config';
import connectDB from '../config/db.js';
import RaceModel from '../models/race.model.js';
import { f1_2025_races } from '../data/f1_2025_races.js';
import logger from '../utils/logger.js';

const seed = async () => {
  try {
    await connectDB();
    await RaceModel.deleteMany({});
    await RaceModel.insertMany(f1_2025_races);
    logger.info('Database seeded: 2025 F1 GP races 🏁');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
