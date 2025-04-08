import { FcGoogle } from 'react-icons/fc';
import { Button } from './ui/button';

interface SigninButtonProps {
  isPending: boolean;
  login: () => void;
}

export const SigninLoader = () => (
  <>
    <div className='relative mr-2 h-4 w-4'>
      <div className='absolute inset-0 animate-spin rounded-full border-2 border-white/20 border-t-white/90'></div>
    </div>
    <span>Signing in...</span>
  </>
);

const SigninButton = ({ isPending, login }: SigninButtonProps) => {
  return (
    <Button
      variant='ghost'
      className='h-10 rounded-full px-4 text-white/90 hover:bg-white/15'
      aria-label={isPending ? 'Signing in' : 'Sign in with Google'}
      onClick={login}
      disabled={isPending}
    >
      {/* if loading render sign in loader otherwise google sign in  */}
      {isPending ? (
        <SigninLoader />
      ) : (
        <>
          <FcGoogle className='mr-2 h-4 w-4' />
          <span>Sign in</span>
        </>
      )}
    </Button>
  );
};

export default SigninButton;
