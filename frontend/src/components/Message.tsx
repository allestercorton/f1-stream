import type { MessageProps } from '@/types/message';
import { useState } from 'react';

const Message = ({ msg, isCurrentUser }: MessageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format timestamp to show only hours and minutes
  const formatTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`mb-4 ${isCurrentUser ? 'ml-auto' : ''} max-w-[85%]`}>
      <div
        className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar - only shown for other users */}
        {!isCurrentUser && (
          <div className='relative flex-shrink-0'>
            <div
              className={`relative h-8 w-8 overflow-hidden rounded-full border border-zinc-700 ${!imageLoaded ? 'bg-zinc-800' : ''}`}
            >
              <img
                src={msg.avatar || '/placeholder.svg?height=32&width=32'}
                alt={`${msg.name}'s avatar`}
                className={`h-full w-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        )}

        {/* Message content */}
        <div
          className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
        >
          {/* Username (only for other users) and timestamp */}
          <div className='mb-1 flex items-center gap-2'>
            {!isCurrentUser && (
              <span className='text-xs font-medium text-zinc-400'>
                {msg.name}
              </span>
            )}
            <span
              className={`text-xs ${isCurrentUser ? 'text-zinc-400' : 'text-zinc-500'}`}
            >
              {formatTime(msg.createdAt)}
            </span>
          </div>

          {/* Message bubble */}
          <div
            className={`rounded-2xl px-3 py-2 text-sm ${
              isCurrentUser
                ? 'bg-white/80 text-black'
                : 'bg-zinc-800 text-white'
            }`}
          >
            {msg.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
