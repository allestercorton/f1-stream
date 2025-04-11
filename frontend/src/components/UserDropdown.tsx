import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User } from '@/types/auth';
import { getInitials } from '@/utils/getInitials';

interface UserDropdownProps {
  user: User;
  logout: () => void;
}

const UserDropdown = ({ user, logout }: UserDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='relative flex-shrink-0 px-0'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-sm font-medium text-white'>
            {getInitials(user.name)}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-44 rounded-xl border border-white/10 bg-black/95 backdrop-blur-md'
      >
        <DropdownMenuLabel className='px-3 py-2 text-zinc-400'>
          {user?.name}
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
