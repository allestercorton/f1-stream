import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import UserAvatar from './UserAvatar';
import { Skeleton } from './ui/skeleton';
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  const {
    isAuthenticated,
    user,
    login,
    logout,
    isPending,
    checkAuthStatus,
    hasCheckedAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className='flex h-[60px] items-center border-b border-white/10 bg-black px-5 py-2'>
      <div className='container mx-auto flex items-center justify-between px-0'>
        <Link to='/'>
          <div className='relative'>
            <div className='text-xl font-medium tracking-tight md:text-2xl'>
              <span className='text-white'>F1</span>
              <span className='font-medium text-red-500'>Stream</span>
            </div>
          </div>
        </Link>

        <div className='flex h-10 items-center'>
          {!hasCheckedAuth ? (
            <div className='h-10 w-10'>
              <Skeleton className='h-full w-full rounded-full bg-zinc-600/50' />
            </div>
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='px-0'>
                <Button
                  variant='ghost'
                  className='h-10 w-10 rounded-full p-0 hover:bg-transparent'
                >
                  <UserAvatar
                    src={user?.profilePicture}
                    name={user?.displayName}
                    className='h-10 w-10 hover:bg-white/5'
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-44 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md'
              >
                <DropdownMenuLabel className='px-3 py-2 text-gray-400'>
                  {user?.displayName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-white/10' />
                <DropdownMenuItem
                  className='mx-1 my-0.5 cursor-pointer rounded-lg px-3 py-2 text-red-400 focus:bg-white/15 focus:text-red-400'
                  onClick={handleLogout}
                >
                  <LogOut className='mr-2 h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant='ghost'
              className='h-10 rounded-full px-4 text-white/90 hover:bg-white/15'
              onClick={login}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className='relative mr-2 h-4 w-4'>
                    <div className='absolute inset-0 animate-spin rounded-full border-2 border-white/20 border-t-white/90'></div>
                  </div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FcGoogle className='mr-2 h-4 w-4' />
                  <span>Sign in</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
