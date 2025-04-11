import { useEffect, useRef, useState } from 'react';
import { getNextSession } from '@/utils/getNextSession';
import { Skeleton } from './ui/skeleton';
import { NextSession } from '@/types/race';

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
  const sessionRef = useRef<NextSession | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      let current = sessionRef.current;

      // check if current session is still valid
      if (current) {
        const start = new Date(current.sessionStart);
        const end = new Date(current.sessionEnd);

        if (now >= start && now <= end) {
          setCountdown('NOW');
          return;
        }

        // session expired
        if (now > end) {
          sessionRef.current = null;
          current = null;
        }
      }

      // load next session if none is active
      if (!current) {
        const next = getNextSession();
        sessionRef.current = next;
        setSession(next);

        if (!next) {
          setCountdown('');
          return;
        }

        current = next;
      }

      // show countdown to session start
      const diff = new Date(current.sessionStart).getTime() - now.getTime();
      setCountdown(formatCountdown(diff));
    };

    updateCountdown(); // initial call
    const interval = setInterval(updateCountdown, 1000);
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
