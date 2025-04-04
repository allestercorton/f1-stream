import { Router } from 'express';
import { getNextRace } from '../controllers/race.controller.js';

const router = Router();

router.get('/next', getNextRace);

export default router;
