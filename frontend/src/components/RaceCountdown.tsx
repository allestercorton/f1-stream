import { useNextRace } from '@/hooks/useNextRace';
import getErrorMessage from '@/utils/handleError';
import { formatCountdown, getSessionStatus } from '@/utils/raceUtils';
import { useEffect, useState } from 'react';

const RaceCountdown = () => {
  const [countdown, setCountdown] = useState('');
  const { data, isPending, error } = useNextRace();
  const { label, sessionName, isLive } = getSessionStatus(data);

  useEffect(() => {
    if (!data) return;

    const updateCountdown = () => {
      if (data.currentSession) {
        setCountdown('LIVE');
      } else if (data.nextSession) {
        setCountdown(formatCountdown(data.nextSession.startTime));
      } else {
        setCountdown('COMPLETED');
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [data]);

  if (isPending) return <StatusPill>Loading...</StatusPill>;
  if (error) return <StatusPill isError>{getErrorMessage(error)}</StatusPill>;
  if (!data) return <StatusPill>No upcoming race</StatusPill>;

  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm backdrop-blur-md transition-all duration-300 ${
        isLive
          ? 'border border-red-800/50 bg-gradient-to-r from-red-950/80 to-red-900/80 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
          : 'border border-zinc-800/50 bg-gradient-to-r from-zinc-950/80 to-zinc-900/80'
      }`}
    >
      <span className='font-medium tracking-tight'>{data.grandPrix}</span>
      <span className='mx-2 text-zinc-500'>•</span>
      <div className='flex items-center gap-1.5'>
        {isLive && (
          <span className='relative flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75'></span>
            <span className='relative inline-flex h-2 w-2 rounded-full bg-red-600'></span>
          </span>
        )}
        <span className={`${isLive ? 'text-red-400' : 'text-zinc-400'}`}>
          {sessionName && `${label}: ${sessionName}`}
          {!sessionName && label}
        </span>
      </div>
      <span className='mx-2 text-zinc-500'>•</span>
      <span className='font-mono text-xs tracking-tight text-zinc-300'>
        {countdown}
      </span>
    </div>
  );
};

const StatusPill = ({
  children,
  isError = false,
}: {
  children: React.ReactNode;
  isError?: boolean;
}) => (
  <div
    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs backdrop-blur-md ${
      isError
        ? 'border border-red-800/50 bg-gradient-to-r from-red-950/80 to-red-900/80 text-red-300'
        : 'border border-zinc-800/50 bg-gradient-to-r from-zinc-950/80 to-zinc-900/80 text-zinc-300'
    }`}
  >
    {children}
  </div>
);

export default RaceCountdown;
