import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>F1Stream - 404</title>
      </Helmet>
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
