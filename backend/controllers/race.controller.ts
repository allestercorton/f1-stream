import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { RaceModel } from '../models/race.model.js';

export const getNextRace = asyncHandler(
  async (_req: Request, res: Response) => {
    const now = new Date();

    const race = await RaceModel.findOne({
      $expr: { $gt: [{ $max: '$sessions.endTime' }, now] },
    }).sort({ 'sessions.startTime': 1 });

    if (!race) throw createHttpError(404, 'No upcoming races found.');

    const currentSession = race.sessions.find(
      (s) => s.startTime <= now && s.endTime >= now
    );

    const nextSession = race.sessions.find((s) => s.startTime > now);

    res.status(200).json({
      grandPrix: race.grandPrix,
      country: race.country,
      hasSprint: race.hasSprint,
      currentSession: currentSession
        ? {
            name: currentSession.name,
            startTime: currentSession.startTime.toISOString(),
            endTime: currentSession.endTime.toISOString(),
          }
        : null,
      nextSession: nextSession
        ? {
            name: nextSession.name,
            startTime: nextSession.startTime.toISOString(),
            endTime: nextSession.endTime.toISOString(),
          }
        : null,
    });
  }
);
