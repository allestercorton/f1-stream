import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if banner has been dismissed before
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('bannerDismissed');
    if (!bannerDismissed) return setIsVisible(true);
  }, []);

  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('bannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className='border-b border-white/10 bg-black px-4 py-2'>
      <div className='container mx-auto flex items-center justify-center'>
        <div className='flex items-center gap-2 text-sm text-white/80'>
          <p>
            For the best streaming experience, we recommend using{' '}
            <a
              href='https://brave.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center text-white underline underline-offset-2 hover:text-white/90'
            >
              Brave Browser <ExternalLink size={12} className='ml-1' />
            </a>{' '}
            or an ad blocker.
          </p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 rounded-full hover:bg-white/10'
          onClick={dismissBanner}
        >
          <X size={14} />
          <span className='sr-only'>Dismiss</span>
        </Button>
      </div>
    </div>
  );
};

export default Banner;
