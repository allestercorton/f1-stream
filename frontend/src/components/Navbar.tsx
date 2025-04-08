import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Skeleton } from './ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import SigninButton from './SigninButton';
import UserDropdown from './UserDropdown';

const Navbar = () => {
  // auth state from zustand store
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const { isAuthenticated, user, login, logout, isPending, hasCheckedAuth } =
    useAuthStore();

  // check auth status on mount
  useEffect(() => {
    checkAuthStatus().catch(() => toast.error('Failed to check auth status.'));
  }, [checkAuthStatus]);

  return (
    <header className='flex h-[60px] items-center border-b border-white/10 bg-black px-5 py-2'>
      <div className='container mx-auto flex items-center justify-between px-0'>
        {/* logo */}
        <Link to='/'>
          <div className='relative'>
            <div className='text-xl font-medium tracking-tight md:text-2xl'>
              <span className='text-white'>F1</span>
              <span className='font-medium text-red-500'>Stream</span>
            </div>
          </div>
        </Link>

        {/* if user is not authenticated render skeleton, if user is authenticated render profile otherwise sign in button */}
        <div className='flex h-10 items-center'>
          {!hasCheckedAuth ? (
            <div className='h-10 w-10'>
              <Skeleton className='h-full w-full rounded-full bg-zinc-600/50' />
            </div>
          ) : isAuthenticated && user ? (
            <UserDropdown user={user} logout={logout} />
          ) : (
            <SigninButton isPending={isPending} login={login} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
