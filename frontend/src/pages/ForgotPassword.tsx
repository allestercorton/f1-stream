import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormButton from '@/components/FormButton';

export default function ForgotPassword() {
  return (
    <div className='flex min-h-screen flex-col bg-black'>
      <Navbar />

      <div className='flex flex-1 items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-semibold'>Reset Password</h1>
            <p className='text-gray-400'>
              Enter your email to receive a password reset link
            </p>
          </div>

          <form className='space-y-6'>
            <div className='space-y-4'>
              {/* Email */}
              <div>
                <Label htmlFor='email' className='text-white'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  className='mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70'
                  autoComplete='email'
                />
              </div>
            </div>

            <FormButton name='Send Reset Link' />

            <div className='text-center text-sm text-gray-400'>
              Remember your password?{' '}
              <Link to='/sign-in' className='text-white hover:underline'>
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
