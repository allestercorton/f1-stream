import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return null;

  return !isAuthenticated ? <Outlet /> : <Navigate to='/profile' replace />;
};

export default PublicRoute;
