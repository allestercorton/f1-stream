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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getInitials } from '@/utils/getInitials';
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, login, logout, isPending, checkAuthStatus } =
    useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className='border-b border-white/10 bg-black px-5 py-2'>
      <div className='container mx-auto flex items-center justify-between px-0'>
        <Link to='/'>
          <div className='relative'>
            <div className='text-xl font-medium tracking-tight md:text-2xl'>
              <span className='text-white'>F1</span>
              <span className='font-medium text-red-500'>Stream</span>
            </div>
          </div>
        </Link>

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='px-0'>
              <Button
                variant='ghost'
                className='rounded-full hover:bg-transparent'
              >
                <Avatar className='hover:bg-white/5'>
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.displayName}
                  />
                  <AvatarFallback className='bg-gray-800 text-white hover:bg-gray-800/80'>
                    {getInitials(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
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
          <button
            onClick={login}
            className='inline-flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-white/90 transition-colors hover:bg-white/15'
          >
            <FcGoogle className='h-4 w-4' />
            <span>{isPending ? 'Signing in...' : 'Sign in'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
