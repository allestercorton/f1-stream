import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import FormButton from '@/components/FormButton';
import InputError from '@/components/InputError';
import {
  ForgotPasswordFormValue,
  forgotPasswordSchema,
} from '@/utils/validation';
import { useForgotPasswordMutation } from '@/hooks/useAuth';

export default function ForgotPassword() {
  const { mutate: forgotPasswordMutate, isPending } =
    useForgotPasswordMutation();

  // React Hook Form setup with validation using Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Handle form submission
  const onSubmit = (data: ForgotPasswordFormValue) => {
    forgotPasswordMutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>F1Stream - Forgot Password</title>
        <meta
          name='description'
          content='Reset your password for F1Stream and regain access to your account.'
        />
        <link
          rel='canonical'
          href='https://f1stream.vercel.app/forgot-password'
        />
        <meta name='robots' content='noindex, follow' />
        <meta name='theme-color' content='#000000' />

        {/* Open Graph (Facebook, Messenger, etc.) */}
        <meta property='og:title' content='F1Stream - Forgot Password' />
        <meta
          property='og:description'
          content='Reset your password for F1Stream and regain access to your account.'
        />
        <meta
          property='og:image'
          content='https://f1stream.vercel.app/preview.png'
        />
        <meta
          property='og:url'
          content='https://f1stream.vercel.app/forgot-password'
        />
        <meta property='og:type' content='website' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='F1Stream - Forgot Password' />
        <meta
          name='twitter:description'
          content='Reset your password for F1Stream and regain access to your account.'
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
            name: 'Forgot Password - F1Stream',
            url: 'https://f1stream.vercel.app/forgot-password',
            description:
              'Reset your password for F1Stream and regain access to your account.',
            image: 'https://f1stream.vercel.app/preview.png',
          })}
        </script>
      </Helmet>
      <div className='flex min-h-screen flex-col bg-black'>
        <Navbar />

        <div className='flex flex-1 items-center justify-center p-4'>
          <div className='w-full max-w-md'>
            <div className='mb-8 text-center'>
              <h1 className='mb-2 text-3xl font-semibold'>Forgot Password</h1>
              <p className='text-gray-400'>
                Enter your email for a password reset link. Check your email
                after submission.
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
              </div>

              <FormButton name='Send Reset Link' isPending={isPending} />

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
    </>
  );
}
