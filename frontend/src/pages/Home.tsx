import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
// import RaceCountdown from '@/components/RaceCountdown';
// import LiveStream from '@/components/LiveStream';
// import ChatInterface from '@/components/ChatInterface';

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
    <main className='min-h-screen bg-black text-white'>
      <Navbar />
      <div className='container mx-auto mt-3 space-y-3 px-4'>
        {/* <RaceCountdown /> */}
        <div className='grid h-[calc(100vh-120px)] grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:col-span-2'>
            {/* <LiveStream /> */}
          </div>
          <div
            className={`h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-950 ${
              isMobile ? 'max-h-[40vh]' : 'max-h-[calc(100vh-120px)]'
            }`}
          >
            {/* <ChatInterface /> */}
          </div>
        </div>
      </div>
    </main>
  );
}
