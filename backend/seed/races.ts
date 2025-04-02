import 'dotenv/config';
import connectDB from '../config/db';
import { RaceModel } from '../models/race.model';
import { f1_2025_races } from '../data/f1_2025_races';

const seed = async () => {
  try {
    await connectDB();
    await RaceModel.deleteMany({});
    await RaceModel.insertMany(f1_2025_races);
    console.log('Database seeded: 2025 F1 GP races 🏁');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
