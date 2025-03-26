import { ReactNode } from 'react';
import { Button } from './ui/button';
import { LoaderCircle } from 'lucide-react';

interface AuthFormProps {
  title: string;
  description: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  footer?: ReactNode;
}

const AuthForm = ({
  title,
  description,
  children,
  onSubmit,
  isLoading,
  error,
  footer,
}: AuthFormProps) => {
  return (
    <div className='w-full max-w-md'>
      <div className='mb-8 text-center'>
        <h1 className='mb-2 text-3xl font-semibold text-white/90'>{title}</h1>
        <p className='text-gray-400'>{description}</p>
      </div>

      {error && (
        <div
          className='animate-fadeIn mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 transition-opacity'
          aria-live='polite'
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className='space-y-6'>
        <div className='space-y-4'>{children}</div>

        <Button
          type='submit'
          className='w-full bg-white text-black hover:bg-white/90'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className='h-4 w-4 animate-spin' />
              <span>Processing... </span>
            </>
          ) : (
            title
          )}
          {title}
        </Button>

        <div className='text-center text-sm text-gray-400'>{footer}</div>
      </form>
    </div>
  );
};

export default AuthForm;
