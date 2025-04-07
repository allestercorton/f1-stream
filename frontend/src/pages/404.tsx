import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <title>F1Stream - Not Found</title>
      <div className='flex min-h-screen flex-col bg-black'>
        <Navbar />
        <div className='flex flex-1 flex-col items-center justify-center p-4 text-center'>
          <div className='mb-3'>
            <div className='text-4xl font-semibold text-white'>404</div>
          </div>

          <h1 className='mb-4 text-xl font-semibold text-white'>
            Page Not Found
          </h1>
        </div>
      </div>
    </>
  );
}
