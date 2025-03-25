import { ReactNode } from 'react';

interface AuthFormProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
  footer?: ReactNode;
}

const AuthForm = ({
  title,
  children,
  onSubmit,
  isLoading,
  error,
  footer,
}: AuthFormProps) => {
  return (
    <div className='mx-auto mt-10 w-full max-w-md rounded-lg bg-white p-8 shadow-lg'>
      <h2 className='mb-6 text-center text-2xl font-bold'>{title}</h2>

      {error && (
        <div
          className='animate-fadeIn mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 transition-opacity'
          aria-live='polite'
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className='space-y-4'>
        {children}

        <button
          type='submit'
          disabled={isLoading}
          className='flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
              Processing...
            </>
          ) : (
            title
          )}
        </button>
      </form>

      {footer && <div className='mt-4 text-center'>{footer}</div>}
    </div>
  );
};

export default AuthForm;
