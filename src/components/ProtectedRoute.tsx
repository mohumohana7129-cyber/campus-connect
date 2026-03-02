import { Navigate } from 'react-router-dom';
import { useAdminAuth, UserRole } from '@/contexts/AdminAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser } = useAdminAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate page based on role
    if (currentUser.role === 'student') {
      return <Navigate to="/" replace />;
    }
    if (currentUser.role === 'organizer') {
      return <Navigate to="/organizer" replace />;
    }
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
