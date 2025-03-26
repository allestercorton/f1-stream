import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
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
                  className='mt-1 border-white/10 bg-gray-900 focus-visible:ring-white/20'
                  autoComplete='email'
                />
              </div>
            </div>

            <Button
              type='submit'
              className='flex w-full items-center justify-center gap-2 bg-white text-black hover:bg-white/90'
            >
              Send Reset Link
            </Button>

            <div className='text-center text-sm text-gray-400'>
              Remember your password?{' '}
              <Link to='/sign-in' className='text-white hover:underline'>
                Sign in
              </Link>
            </div>
          </form>

          <div className='mt-12 text-center text-xs text-gray-500'>
            <p>© 2025 F1Stream. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
