import ChatInterface from '@/components/ChatInterface';
import LiveStream from '@/components/LiveStream';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      <Navbar />
      <div className='container mx-auto px-4 py-6'>
        <div className='grid h-[calc(100vh-120px)] grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:col-span-2'>
            <LiveStream />
          </div>
          <div className='h-full max-h-[calc(100vh-120px)] overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:max-h-full'>
            <ChatInterface />
          </div>
        </div>
      </div>
    </main>
  );
}
