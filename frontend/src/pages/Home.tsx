import { Helmet } from 'react-helmet-async';
import ChatInterface from '@/components/ChatInterface';
import LiveStream from '@/components/LiveStream';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>F1Stream - Watch</title>
      </Helmet>
      <main className='min-h-screen bg-black text-white'>
        <Navbar />
        <div className='container mx-auto px-4 py-6'>
          {/* Adjusted grid layout to give chat more space on widescreen */}
          <div className='grid h-[calc(100vh-120px)] grid-cols-1 gap-6 lg:grid-cols-3'>
            {/* Livestream takes 2/3 of the space on larger screens */}
            <div className='relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:col-span-2'>
              <LiveStream />
            </div>

            {/* Chat interface - full width on mobile, 1/3 on desktop */}
            <div
              className={`h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-950 ${
                isMobile ? 'max-h-[40vh]' : 'max-h-[calc(100vh-120px)]'
              }`}
            >
              <ChatInterface />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
