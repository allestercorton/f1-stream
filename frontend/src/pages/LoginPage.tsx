import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthForm from '../components/AuthForm';
import useAuthStore from '../stores/authStore';
import { LoginInputs, loginSchema } from '../utils/validation';

export default function LoginPage() {
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

  return (
    <div className='container mx-auto px-4'>
      <AuthForm
        title='Login'
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
        error={error}
        footer={
          <p>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-600 hover:underline'>
              Register
            </Link>
          </p>
        }
      >
        {(['email', 'password'] as (keyof LoginInputs)[]).map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className='mb-1 block capitalize text-gray-700'
            >
              {field}
            </label>
            <input
              id={field}
              type={field === 'password' ? 'password' : 'email'}
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
