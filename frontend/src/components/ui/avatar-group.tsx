import type React from 'react';
import { Avatar, AvatarFallback } from './avatar';
import { cn } from '@/lib/utils';

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars: {
    name: string;
    image?: string;
  }[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarGroup({
  avatars,
  max = 3,
  size = 'md',
  className,
  ...props
}: AvatarGroupProps) {
  const showAvatars = avatars.slice(0, max);
  const remainingAvatars = avatars.length > max ? avatars.length - max : 0;

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  return (
    <div
      className={cn('flex -space-x-2 overflow-hidden', className)}
      {...props}
    >
      {showAvatars.map((avatar, i) => (
        <Avatar
          key={i}
          className={cn(
            'border-2 border-gray-900 bg-gray-800',
            sizeClasses[size],
          )}
        >
          <AvatarFallback className='bg-gray-800'>{avatar.name}</AvatarFallback>
        </Avatar>
      ))}
      {remainingAvatars > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full border-2 border-gray-900 bg-gray-800',
            sizeClasses[size],
          )}
        >
          +{remainingAvatars}
        </div>
      )}
    </div>
  );
}
