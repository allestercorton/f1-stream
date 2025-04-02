import { Router } from 'express';
import { getNextRace } from '../controllers/race.controller';

const router = Router();

router.get('/next', getNextRace);

export default router;
