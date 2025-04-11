import { useEffect, useState } from 'react';
import { getNextSession } from '@/utils/getNextSession';
import { Skeleton } from './ui/skeleton';
import { NextSession } from '@/types/race';

// formats ms difference into countdown string
const formatCountdown = (diff: number) => {
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const RaceCountdown = () => {
  const [session, setSession] = useState<NextSession | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getNextSession();
      setSession(next);

      if (!next) {
        setCountdown('');
        return;
      }

      const now = new Date();
      const sessionStart = new Date(next.sessionStart); // PHT (UTC+8)

      // Calculate the difference in time between now and the session start
      const countdownDiff = sessionStart.getTime() - now.getTime();

      // Always show countdown to the next session
      setCountdown(formatCountdown(countdownDiff));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (!session)
    return (
      <div className='inline-flex items-center px-3 py-1.5 text-sm'>
        <Skeleton className='h-4 w-32 bg-zinc-800/50' />
        <span className='mx-2 text-zinc-800/50'>•</span>
        <Skeleton className='h-4 w-16 bg-zinc-800/50' />
        <span className='mx-2 text-zinc-800/50'>•</span>
        <Skeleton className='h-4 w-24 bg-zinc-800/50' />
      </div>
    );

  return (
    <div className='flex flex-col items-center gap-1 px-0 py-1.5 text-sm font-medium sm:flex-row sm:items-center sm:gap-0 sm:px-4 md:items-start'>
      <span className='tracking-tight'>{session.grandPrix}</span>
      <span className='hidden text-zinc-500 sm:mx-2 sm:block'>•</span>
      <div className='flex items-center gap-1.5 text-zinc-400'>
        {session.sessionName}
      </div>
      <span className='hidden text-zinc-500 sm:mx-2 sm:block'>•</span>
      <span className='font-mono text-lg tracking-tight text-zinc-300 md:text-sm'>
        {countdown}
      </span>
    </div>
  );
};

export default RaceCountdown;
