import { NextSession, Race } from '@/types/race';
import { f1_2025_races } from '../data/f1_2025_races';

// helper function to get the next session
export const getNextSession = (): NextSession => {
  const now = new Date();

  // find the next session after the current time
  for (const race of f1_2025_races as Race[]) {
    for (const session of race.sessions) {
      // convert session start and end times to the local time zone
      const localSessionStart = new Date(session.startTime.toLocaleString());
      const localSessionEnd = new Date(session.endTime.toLocaleString());

      // check if the session is the next one upcoming after now
      if (now < localSessionStart) {
        return {
          grandPrix: race.grandPrix,
          circuit: race.circuit,
          country: race.country,
          sessionName: session.name,
          sessionStart: localSessionStart,
          sessionEnd: localSessionEnd,
        };
      }
    }
  }

  // if no session is found, return null
  return null;
};
