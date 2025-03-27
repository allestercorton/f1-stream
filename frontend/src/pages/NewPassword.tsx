import FormButton from '@/components/FormButton';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewPassword() {
  return (
    <div className='flex min-h-screen flex-col bg-black'>
      <Navbar />

      <div className='flex flex-1 items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-semibold'>Set New Password</h1>
            <p className='text-gray-400'>Enter your new password below</p>
          </div>

          <form className='space-y-6'>
            <div className='space-y-4'>
              {/* New Password */}
              <div>
                <Label htmlFor='new-password' className='text-white'>
                  New Password
                </Label>
                <Input
                  id='new-password'
                  type='password'
                  placeholder='New Password'
                  className='mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70'
                  autoComplete='new-password'
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor='confirm-password' className='text-white'>
                  Confirm Password
                </Label>
                <Input
                  id='confirm-password'
                  type='password'
                  placeholder='Confirm Password'
                  className='mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70'
                  autoComplete='new-password'
                />
              </div>
            </div>

            <FormButton name='Reset Password' />
          </form>
        </div>
      </div>
    </div>
  );
}
