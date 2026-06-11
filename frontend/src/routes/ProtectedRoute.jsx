import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Loader from '../components/ui/Loader';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <Loader className="min-h-screen" />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
