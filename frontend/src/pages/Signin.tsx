import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/InputError';
import FormButton from '@/components/FormButton';
import { loginSchema, type LoginFormValues } from '../utils/validation';
import { useAuthStore } from '../store/authStore';

export default function Signin() {
  const navigate = useNavigate();
  const { login: loginUser, isPending } = useAuthStore();

  // React Hook Form setup with validation using Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    const success = await loginUser(data);
    if (success) navigate('/');
  };

  return (
    <>
      <title>F1Stream - Sign In</title>
      <div className='flex min-h-screen flex-col bg-black'>
        <Navbar />

        <div className='flex flex-1 items-center justify-center p-4'>
          <div className='w-full max-w-md'>
            <div className='mb-8 text-center'>
              <h1 className='mb-2 text-3xl font-semibold'>Sign In</h1>
              <p className='text-gray-400'>
                Enter your credentials to join the conversation
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                {/* Email */}
                <div>
                  <Label htmlFor='email' className='text-white'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    {...register('email')}
                    placeholder='name@example.com'
                    className={`mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70 ${
                      errors.email
                        ? 'border-red-600 focus-visible:border-white/10'
                        : 'border-white/10 focus-visible:ring-white/10'
                    }`}
                    autoComplete='email'
                    disabled={isPending}
                  />
                  <InputError errors={errors} field='email' />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor='password' className='text-white'>
                    Password
                  </Label>
                  <Input
                    id='password'
                    type='password'
                    {...register('password')}
                    placeholder='Password'
                    className={`mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70 ${
                      errors.password
                        ? 'border-red-600 focus-visible:border-white/10'
                        : 'border-white/10 focus-visible:ring-white/10'
                    }`}
                    autoComplete='current-password'
                    disabled={isPending}
                  />
                  <InputError errors={errors} field='password' />
                  <div className='mt-3 flex justify-end'>
                    <Link
                      to='/forgot-password'
                      className='text-xs text-gray-400 hover:text-white'
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>

              <FormButton name='Sign In' isPending={isPending} />

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-white/10' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-black px-2 text-gray-400'>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <button
                type='button'
                // onClick={handleGoogleSignIn}
                disabled={isPending}
                className='flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-50'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    fill='#4285F4'
                  />
                  <path
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    fill='#34A853'
                  />
                  <path
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    fill='#EA4335'
                  />
                </svg>
                Continue with Google
              </button>

              <div className='text-center text-sm text-gray-400'>
                Don't have an account?{' '}
                <Link to='/sign-up' className='text-white hover:underline'>
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
