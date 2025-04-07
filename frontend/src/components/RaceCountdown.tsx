import { useEffect, useState } from 'react';
import { getNextSession, NextSession } from '@/utils/getNextSession';
import { Skeleton } from './ui/skeleton';

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
      <div className='inline-flex items-center rounded-full border border-zinc-800/50 bg-gradient-to-r from-zinc-950/80 to-zinc-900/80 px-3 py-1.5 text-sm backdrop-blur-md'>
        <Skeleton className='h-4 w-28 bg-zinc-800/50' />
        <span className='mx-2 text-zinc-500'>•</span>
        <Skeleton className='h-4 w-16 bg-zinc-800/50' />
        <span className='mx-2 text-zinc-500'>•</span>
        <Skeleton className='h-4 w-24 bg-zinc-800/50' />
      </div>
    );

  return (
    <div className='inline-flex items-center rounded-full border border-zinc-800/50 bg-gradient-to-r from-zinc-950/80 to-zinc-900/80 px-4 py-1.5 text-sm backdrop-blur-md'>
      <span className='font-medium tracking-tight'>{session.grandPrix}</span>
      <span className='mx-2 text-zinc-500'>•</span>
      <div className='flex items-center gap-1.5 text-zinc-400'>
        {session.sessionName}
      </div>
      <span className='mx-2 text-zinc-500'>•</span>
      <span className='font-mono text-xs tracking-tight text-zinc-300'>
        {countdown}
      </span>
    </div>
  );
};

export default RaceCountdown;
