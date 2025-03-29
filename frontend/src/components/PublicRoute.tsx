import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicRoute;
