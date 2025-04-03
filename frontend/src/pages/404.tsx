import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      {/* Metadata tags */}
      <>
        {/* Primary Meta Tags */}
        <title>F1Stream - Page Not Found</title>
        <meta
          name='description'
          content="Oops! The page you are looking for doesn't exist. Return to F1Stream to watch live Formula 1 races."
        />
        <meta name='robots' content='noindex, follow' />
        <meta name='theme-color' content='#000000' />

        {/* Open Graph (Facebook, Messenger, etc.) */}
        <meta property='og:title' content='F1Stream - 404 Not Found' />
        <meta
          property='og:description'
          content="Oops! The page you are looking for doesn't exist. Return to F1Stream to watch live Formula 1 races."
        />
        <meta
          property='og:image'
          content='https://f1stream.vercel.app/preview.png'
        />
        <meta property='og:url' content='https://f1stream.vercel.app/404' />
        <meta property='og:type' content='website' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='F1Stream - 404 Not Found' />
        <meta
          name='twitter:description'
          content="Oops! The page you are looking for doesn't exist. Return to F1Stream to watch live Formula 1 races."
        />
        <meta
          name='twitter:image'
          content='https://f1stream.vercel.app/preview.png'
        />

        {/* JSON-LD Structured Data for Google SEO */}
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '404 - Page Not Found',
            description:
              "Oops! The page you are looking for doesn't exist. Return to F1Stream to watch live Formula 1 races.",
            url: 'https://f1stream.vercel.app/404',
          })}
        </script>
      </>
      <div className='flex min-h-screen flex-col bg-black'>
        <Navbar />
        <div className='flex flex-1 flex-col items-center justify-center p-4 text-center'>
          <div className='mb-6'>
            <div className='text-9xl font-semibold text-white'>404</div>
          </div>

          <h1 className='mb-4 text-2xl font-semibold text-white md:text-3xl'>
            Page Not Found
          </h1>

          <p className='mb-8 max-w-md text-gray-400'>
            The page you're looking for doesn't exist or has been removed to
            another URL.
          </p>

          <div className='space-x-4'>
            <Button
              asChild
              variant='outline'
              className='border-white/20 text-white hover:bg-white/10 hover:text-white/90'
            >
              <Link to='/sign-in'>Sign In</Link>
            </Button>
            <Button asChild className='bg-white text-black hover:bg-white/90'>
              <Link to='/'>Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
