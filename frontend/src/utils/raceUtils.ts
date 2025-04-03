import { RaceData } from '@/types/race';

export const formatCountdown = (
  targetDate: string,
  timezoneOffsetHours: number = 8,
): string => {
  const now = new Date();

  // Convert targetDate (assumed to be in PHT) to UTC by subtracting the offset
  const target = new Date(targetDate);
  const targetUTC = new Date(
    target.getTime() - timezoneOffsetHours * 60 * 60 * 1000,
  );

  const diff = targetUTC.getTime() - now.getTime();

  if (diff <= 0) return 'NOW';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const parts = [
    days > 0 ? `${days}d ` : '',
    `${hours}h `,
    `${minutes}m `,
    `${seconds}s `,
  ];

  return parts.join('').trim();
};

export const getSessionStatus = (
  race: RaceData | undefined,
): { label: string; sessionName: string; isLive: boolean } => {
  if (!race) return { label: 'LOADING', sessionName: '', isLive: false };

  if (race.currentSession) {
    return {
      label: 'ONGOING',
      sessionName: race.currentSession.name,
      isLive: true,
    };
  }

  if (race.nextSession) {
    return { label: 'NEXT', sessionName: race.nextSession.name, isLive: false };
  }

  return { label: 'COMPLETED', sessionName: '', isLive: false };
};
