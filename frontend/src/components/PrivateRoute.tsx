
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
