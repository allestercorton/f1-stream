import { useEffect, useState } from 'react';
import type { TypingUser } from '../../types/chat';

interface TypingIndicatorProps {
  users: TypingUser[];
}

const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  const [displayText, setDisplayText] = useState<string>('');

  useEffect(() => {
    if (users.length === 0) {
      setDisplayText('');
    } else if (users.length === 1) {
      setDisplayText(`${users[0].displayName} is typing`);
    } else if (users.length === 2) {
      setDisplayText(
        `${users[0].displayName} and ${users[1].displayName} are typing`,
      );
    } else if (users.length === 3) {
      setDisplayText(
        `${users[0].displayName}, ${users[1].displayName}, and ${users[2].displayName} are typing`,
      );
    } else {
      setDisplayText(`${users.length} people are typing`);
    }
  }, [users]);

  if (users.length === 0) return null;

  return (
    <div className='flex items-center gap-2 px-2 py-1 text-sm text-zinc-400'>
      <div className='flex'>
        <DotAnimation />
      </div>
      <span>{displayText}</span>
    </div>
  );
};

const DotAnimation = () => {
  return (
    <div className='flex items-center gap-1'>
      <div className='flex space-x-1'>
        <div
          className='h-2 w-2 animate-bounce rounded-full bg-zinc-400'
          style={{ animationDelay: '0ms' }}
        ></div>
        <div
          className='h-2 w-2 animate-bounce rounded-full bg-zinc-400'
          style={{ animationDelay: '150ms' }}
        ></div>
        <div
          className='h-2 w-2 animate-bounce rounded-full bg-zinc-400'
          style={{ animationDelay: '300ms' }}
        ></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
