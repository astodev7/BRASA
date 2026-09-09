import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from './LoadingState';

export default function RequireAdminAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <LoadingState label="Verificando sessão..." />;

  if (status === 'anonymous') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
