import Navbar from '@/components/Navbar';
import RaceCountdown from '@/components/RaceCountdown';
import LiveStream from '@/components/LiveStream';
import ChatBox from '@/components/Chatbox';

export default function Home() {
  return (
    <main className='min-h-screen bg-black text-white'>
      <Navbar />
      <div className='container mx-auto mt-3 space-y-3 px-4'>
        <RaceCountdown />
        <div className='grid grid-cols-1 gap-6 lg:h-[calc(100vh-120px)] lg:grid-cols-3'>
          {/* livestream section */}
          <div className='relative h-[200px] overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:col-span-2 lg:h-full'>
            <LiveStream />
          </div>
          {/* chatbox section */}
          <div className='h-[400px] overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:h-full'>
            <ChatBox />
          </div>
        </div>
      </div>
    </main>
  );
}
