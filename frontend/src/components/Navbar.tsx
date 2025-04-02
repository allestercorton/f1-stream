import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import Logo from './Logo';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils/getInitials';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className='border-b border-white/10 bg-black px-5 py-2'>
      <div className='container mx-auto flex items-center justify-between px-0'>
        <Link to='/'>
          <Logo />
        </Link>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='px-0'>
              <Button
                variant='ghost'
                className='rounded-full hover:bg-transparent'
              >
                <Avatar className='hover:bg-white/5'>
                  <AvatarFallback className='bg-gray-800 text-white hover:bg-gray-800/80'>
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-56 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md'
            >
              <DropdownMenuLabel className='px-3 py-2 text-gray-400'>
                {user?.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className='bg-white/10' />
              <DropdownMenuItem
                className='mx-1 my-0.5 cursor-pointer rounded-lg px-3 py-2 text-red-400 focus:bg-white/10 focus:text-red-400'
                onClick={logout}
              >
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to='/sign-in'>
            <Button
              variant='ghost'
              className='rounded-full px-4 text-white/90 hover:bg-white/10'
            >
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
