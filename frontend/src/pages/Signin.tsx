import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        {/* Primary Meta Tags */}
        <title>F1Stream - Sign In</title>
        <meta
          name='description'
          content='Sign in to F1Stream to watch live Formula 1 races and join the global chat.'
        />
        <link rel='canonical' href='https://f1stream.vercel.app/sign-in' />
        <meta name='robots' content='noindex, follow' />
        <meta name='theme-color' content='#000000' />

        {/* Open Graph (Facebook, Messenger, etc.) */}
        <meta property='og:title' content='F1Stream - Sign In' />
        <meta
          property='og:description'
          content='Sign in to F1Stream to watch live Formula 1 races and join the global chat.'
        />
        <meta
          property='og:image'
          content='https://f1stream.vercel.app/preview.png'
        />
        <meta property='og:url' content='https://f1stream.vercel.app/sign-in' />
        <meta property='og:type' content='website' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='F1Stream - Sign In' />
        <meta
          name='twitter:description'
          content='Sign in to F1Stream to watch live Formula 1 races and join the global chat.'
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
            name: 'Sign In - F1Stream',
            url: 'https://f1stream.vercel.app/sign-in',
            description:
              'Sign in to F1Stream to watch live Formula 1 races and join the global chat.',
            image: 'https://f1stream.vercel.app/preview.png',
          })}
        </script>
      </Helmet>
      <div className='flex min-h-screen flex-col bg-black'>
        <Navbar />

        <div className='flex flex-1 items-center justify-center p-4'>
          <div className='w-full max-w-md'>
            <div className='mb-8 text-center'>
              <h1 className='mb-2 text-3xl font-semibold'>Sign In</h1>
              <p className='text-gray-400'>
                Enter your credentials to access your account
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
