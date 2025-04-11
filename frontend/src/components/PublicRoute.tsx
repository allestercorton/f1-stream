import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = () => {
  const { isAuthenticated, isPending } = useAuthStore();

  if (isPending) return null;

  return isAuthenticated ? <Navigate to='/' replace /> : <Outlet />;
};

export default PublicRoute;
