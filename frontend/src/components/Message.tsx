import type { MessageProps } from '@/types/message';
import { getInitials } from '@/utils/getInitials';
import { formatTime } from '@/utils/formatTime';

const Message = ({ msg, isCurrentUser }: MessageProps) => {
  return (
    <div className={`mb-4 ${isCurrentUser ? 'ml-auto' : ''} max-w-[85%]`}>
      <div
        className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar - only shown for other users */}
        {!isCurrentUser && (
          <div className='relative flex-shrink-0'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-white'>
              {getInitials(msg.name)}
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
