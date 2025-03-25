import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthForm from '../components/AuthForm';
import useAuthStore from '../stores/authStore';
import { RegisterInputs, registerSchema } from '../utils/validation';

export default function RegisterPage() {
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
    const success = await registerUser(
      data.name,
      data.email,
      data.password,
      data.confirmPassword,
    );
    if (success) navigate('/');
  };

  return (
    <div className='container mx-auto px-4'>
      <AuthForm
        title='Create an Account'
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
        error={error}
        footer={
          <p>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Login
            </Link>
          </p>
        }
      >
        {(
          [
            'name',
            'email',
            'password',
            'confirmPassword',
          ] as (keyof RegisterInputs)[]
        ).map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className='mb-1 block capitalize text-gray-700'
            >
              {field}
            </label>
            <input
              id={field}
              type={
                field === 'password' || field === 'confirmPassword'
                  ? 'password'
                  : 'text'
              }
              {...register(field)}
              disabled={isLoading}
              className='w-full rounded border p-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
              autoComplete='on'
            />
            {errors[field]?.message && (
              <p className='mt-1 text-sm text-red-600'>
                {errors[field]?.message}
              </p>
            )}
          </div>
        ))}
      </AuthForm>
    </div>
  );
}
