import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className='bg-blue-600 p-4 text-white'>
      <div className='container mx-auto flex items-center justify-between'>
        <Link to='/' className='text-xl font-bold'>
          MERN Auth
        </Link>
        <div className='space-x-4'>
          {isAuthenticated ? (
            <>
              <Link to='/profile' className='hover:text-blue-200'>
                Profile
              </Link>
              <button
                onClick={logout}
                className='rounded bg-white px-3 py-1 text-blue-600 hover:bg-blue-100'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='hover:text-blue-200'>
                Login
              </Link>
              <Link
                to='/register'
                className='rounded bg-white px-3 py-1 text-blue-600 hover:text-blue-500'
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
