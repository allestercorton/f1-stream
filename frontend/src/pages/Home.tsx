import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import RaceCountdown from '@/components/RaceCountdown';
import LiveStream from '@/components/LiveStream';
import ChatInterface from '@/components/ChatInterface';

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
        {/* Primary Meta Tags */}
        <title>F1Stream - Watch Live F1 Streams</title>
        <meta
          name='description'
          content='Watch live Formula 1 races in high quality for free. Join global chat.'
        />
        <link rel='canonical' href='https://f1stream.vercel.app/' />
        <meta name='robots' content='index, follow' />
        <meta name='theme-color' content='#000000' />

        {/* Favicon & Preload */}
        <link rel='icon' type='image/png' href='/logo.png' />
        <link rel='apple-touch-icon' href='/logo.png' />
        <link rel='preload' as='image' href='/logo.png' />

        {/* Open Graph (Facebook, Messenger, etc.) */}
        <meta property='og:title' content='F1Stream - Watch Live F1 Streams' />
        <meta
          property='og:description'
          content='Watch live Formula 1 races in high quality for free. Join global chat.'
        />
        <meta
          property='og:image'
          content='https://f1stream.vercel.app/preview.png'
        />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:url' content='https://f1stream.vercel.app/' />
        <meta property='og:type' content='website' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='F1Stream - Watch Live F1 Streams' />
        <meta
          name='twitter:description'
          content='Watch live Formula 1 races in high quality for free. Join global chat.'
        />
        <meta
          name='twitter:image'
          content='https://f1stream.vercel.app/preview.png'
        />

        {/* JSON-LD Structured Data for Google SEO */}
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'F1Stream',
            url: 'https://f1stream.vercel.app/',
            description:
              'Watch live Formula 1 streams in high quality for free. Join global chat.',
            image: 'https://f1stream.vercel.app/preview.png',
          })}
        </script>
      </Helmet>
      <main className='min-h-screen bg-black text-white'>
        <Navbar />
        <div className='container mx-auto mt-3 space-y-3 px-4'>
          <RaceCountdown />
          <div className='grid h-[calc(100vh-120px)] grid-cols-1 gap-6 lg:grid-cols-3'>
            <div className='relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-950 lg:col-span-2'>
              <LiveStream />
            </div>
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
