import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import UserDropdown from './UserDropdown';
import { Button } from './ui/button';

const Navbar = () => {
  // auth states
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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

        <div className='flex h-10 items-center'>
          {isAuthenticated && user ? (
            <UserDropdown user={user} logout={logout} />
          ) : (
            <Link to='/sign-in'>
              <Button
                variant='ghost'
                className='h-10 rounded-full px-4 text-white/90 hover:bg-white/15'
                aria-label='Sign in link'
              >
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
