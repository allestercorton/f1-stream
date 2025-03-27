import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import useAuthStore from '../stores/authStore';
import { RegisterInputs, registerSchema } from '../utils/validation';
import Navbar from '@/components/Navbar';
import InputError from '@/components/InputError';
import FormButton from '@/components/FormButton';

export default function Signup() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInputs) => {
    await registerUser(
      data.name,
      data.email,
      data.password,
      data.confirmPassword,
    );
    navigate('/');
  };

  if (error) toast.error((error as { message?: string })?.message || error);

  return (
    <div className='flex min-h-screen flex-col bg-black'>
      <Navbar />

      <div className='flex flex-1 items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-semibold'>Create Account</h1>
            <p className='text-gray-400'>
              Enter your details to create a new account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              {/* Name */}
              <div>
                <Label htmlFor='name' className='text-white'>
                  Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  {...register('name')}
                  placeholder='Name'
                  className={`mt-1 border-white/10 bg-gray-900 py-6 focus-visible:ring-white/70 ${
                    errors.name
                      ? 'border-red-600 focus-visible:border-white/10'
                      : 'border-white/10 focus-visible:ring-white/10'
                  }`}
                  autoComplete='name'
                  disabled={isLoading}
                />
                <InputError errors={errors} field='name' />
              </div>

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
                    errors.password
                      ? 'border-red-600 focus-visible:border-white/10'
                      : 'border-white/10 focus-visible:ring-white/10'
                  }`}
                  autoComplete='new-password'
                  disabled={isLoading}
                />
                <InputError errors={errors} field='password' />
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
                  disabled={isLoading}
                />
                <InputError errors={errors} field='confirmPassword' />
              </div>
            </div>

            <FormButton name='Sign Up' isLoading={isLoading} />

            <div className='text-center text-sm text-gray-400'>
              Already have an account?{' '}
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
