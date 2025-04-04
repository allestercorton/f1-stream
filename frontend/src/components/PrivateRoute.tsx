import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PrivateRoute = () => {
  const { isAuthenticated, isPending } = useAuthStore();

  if (isPending) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to='/sign-in' replace />;
};

export default PrivateRoute;
