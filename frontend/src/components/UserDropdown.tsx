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
import UserAvatar from './UserAvatar';
import { User } from '@/types/auth';

interface UserDropdownProps {
  user: User;
  logout: () => void;
}

const UserDropdown = ({ user, logout }: UserDropdownProps) => {
  return (
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
          onClick={logout}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
