import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { getInitials } from '@/utils/getInitials';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  src,
  name = '',
  className = '',
  fallbackClassName = '',
}: UserAvatarProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading and error states when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Avatar className={`h-10 w-10 ${className}`}>
      {src && !hasError && (
        <AvatarImage
          src={src}
          alt={name || 'User avatar'}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={
            isLoading
              ? 'opacity-0'
              : 'opacity-100 transition-opacity duration-200'
          }
        />
      )}

      {isLoading && (
        <Skeleton className='absolute inset-0 h-full w-full rounded-full bg-gray-700' />
      )}

      {(!src || hasError) && !isLoading && (
        <AvatarFallback
          className={`bg-gray-800 text-white hover:bg-gray-800/80 ${fallbackClassName}`}
        >
          {getInitials(name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
