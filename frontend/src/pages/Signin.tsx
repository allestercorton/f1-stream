import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoginInputs, loginSchema } from '../utils/validation';
import useAuthStore from '../stores/authStore';
import InputError from '@/components/InputError';
import FormButton from '@/components/FormButton';

export default function Signin() {
  const navigate = useNavigate();
  const { login: loginUser, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    const success = await loginUser(data.email, data.password);
    if (success) navigate('/');
  };

  if (error) toast.error((error as { message?: string })?.message || error);

  return (
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
                    errors.password &&
                    'border-red-600 focus-visible:border-white/10'
                  }`}
                  autoComplete='email'
                  disabled={isLoading}
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
                    errors.password &&
                    'border-red-600 focus-visible:border-white/10'
                  }`}
                  autoComplete='current-password'
                  disabled={isLoading}
                />
                <InputError errors={errors} field='password' />
                <div className='mt-2 flex justify-end'>
                  <Link
                    to='/forgot-password'
                    className='text-xs text-gray-400 hover:text-white'
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <FormButton name='Sign In' isLoading={isLoading} />

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
  );
}
