import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import FormButton from '@/components/FormButton';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from '@/utils/validation';
import { useResetPasswordMutation } from '@/hooks/useAuth';
import InputError from '@/components/InputError';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { mutate: resetPasswordMutate, isPending } = useResetPasswordMutation();

  // Read Hook Form setup with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Handle form submission
  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      console.error('Invalid or missing token');
      return;
    }

    resetPasswordMutate(
      { data, token },
      {
        onSuccess: () => {
          reset();
          navigate('/sign-in');
        },
      },
    );
  };

  return (
    <>
      {/* Metadata tags */}
      <>
        {/* Primary Meta Tags */}
        <title>F1Stream - Reset Password</title>
        <meta
          name='description'
          content='Securely reset your password for F1Stream and regain access to your account.'
        />
        <link
          rel='canonical'
          href='https://f1stream.vercel.app/reset-password'
        />
        <meta name='robots' content='noindex, follow' />
        <meta name='theme-color' content='#000000' />

        {/* Open Graph (Facebook, Messenger, etc.) */}
        <meta property='og:title' content='F1Stream - Reset Password' />
        <meta
          property='og:description'
          content='Securely reset your password for F1Stream and regain access to your account.'
        />
        <meta
          property='og:image'
          content='https://f1stream.vercel.app/preview.png'
        />
        <meta
          property='og:url'
          content='https://f1stream.vercel.app/reset-password'
        />
        <meta property='og:type' content='website' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='F1Stream - Reset Password' />
        <meta
          name='twitter:description'
          content='Securely reset your password for F1Stream and regain access to your account.'
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
            name: 'Reset Password - F1Stream',
            url: 'https://f1stream.vercel.app/reset-password',
            description:
              'Securely reset your password for F1Stream and regain access to your account.',
            image: 'https://f1stream.vercel.app/preview.png',
          })}
        </script>
      </>
      <div className='flex min-h-screen flex-col bg-black'>
        <Navbar />

        <div className='flex flex-1 items-center justify-center p-4'>
          <div className='w-full max-w-md'>
            <div className='mb-8 text-center'>
              <h1 className='mb-2 text-3xl font-semibold'>Set New Password</h1>
              <p className='text-gray-400'>Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='space-y-4'>
                {/* New Password */}
                <div>
                  <Label htmlFor='new-password' className='text-white'>
                    New Password
                  </Label>
                  <Input
                    id='new-password'
                    type='password'
                    {...register('newPassword')}
                    placeholder='New Password'
                    className={`mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70 ${
                      errors.newPassword
                        ? 'border-red-600 focus-visible:border-white/10'
                        : 'border-white/10 focus-visible:ring-white/10'
                    }`}
                    autoComplete='new-password'
                    disabled={isPending}
                  />
                  <InputError errors={errors} field='newPassword' />
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor='confirm-password' className='text-white'>
                    Confirm Password
                  </Label>
                  <Input
                    id='confirm-password'
                    type='password'
                    {...register('confirmPassword')}
                    placeholder='Confirm Password'
                    className={`mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70 ${
                      errors.confirmPassword
                        ? 'border-red-600 focus-visible:border-white/10'
                        : 'border-white/10 focus-visible:ring-white/10'
                    }`}
                    autoComplete='new-password'
                    disabled={isPending}
                  />
                  <InputError errors={errors} field='confirmPassword' />
                </div>
              </div>

              <FormButton name='Reset Password' isPending={isPending} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
