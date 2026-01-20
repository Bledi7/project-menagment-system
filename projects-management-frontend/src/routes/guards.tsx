import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { UserRole } from '@/types';
import { ROUTES, ROLES } from '@/utils/constants';
import { Loading } from '@/components/ui/Loading';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  
  // Check localStorage directly as fallback (in case persist hasn't hydrated)
  const token = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('auth-storage');
  let parsedUser = null;
  
  try {
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsedUser = parsed.state?.user;
    }
  } catch {
    // Ignore parse errors
  }

  // Check both store and localStorage
  const hasAuth = (isAuthenticated && user) || (token && parsedUser);
  const currentUser = user || parsedUser;

  // If we have a token but store isn't ready yet, wait briefly (max 500ms)
  if (token && (!isAuthenticated || !user) && parsedUser) {
    // Store is hydrating, show loading
    return <Loading />;
  }

  // No auth at all - redirect to login
  if (!hasAuth || !currentUser) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Use currentUser (from store or localStorage)
  const effectiveUser = user || parsedUser;

  if (allowedRoles && effectiveUser && !allowedRoles.includes(effectiveUser.role as UserRole)) {
    // Redirect to user's dashboard if they don't have access
    const dashboardRoute = getDashboardRoute(effectiveUser.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  return <Outlet />;
};

// Helper function to get dashboard route based on user role
const getDashboardRoute = (role: string): string => {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.ADMIN;
    case ROLES.PRODUCT_OWNER:
      return ROUTES.PRODUCT_OWNER;
    case ROLES.SCRUM_MASTER:
      return ROUTES.SCRUM_MASTER;
    case ROLES.DEVELOPER:
      return ROUTES.DEVELOPER;
    default:
      return ROUTES.HOME;
  }
};

export const PublicRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  // Check localStorage as fallback
  const token = localStorage.getItem('accessToken');
  const storedUser = localStorage.getItem('auth-storage');
  let parsedUser = null;
  
  try {
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsedUser = parsed.state?.user;
    }
  } catch {
    // Ignore parse errors
  }

  // If authenticated (from store or localStorage), redirect to dashboard
  const currentUser = user || parsedUser;
  if ((isAuthenticated && user) || (token && parsedUser)) {
    const dashboardRoute = getDashboardRoute(currentUser.role);
    return <Navigate to={dashboardRoute} replace />;
  }

  return <Outlet />;
};
