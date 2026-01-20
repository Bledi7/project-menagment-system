import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES, ROLES } from '@/utils/constants';

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

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect authenticated users directly to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      // Immediate redirect
      navigate(dashboardRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Don't render anything if user is authenticated (will redirect)
  if (isAuthenticated && user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Project Management System
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Manage your projects, teams, and sprints efficiently
        </p>
        <div className="flex gap-4 justify-center">
          <Link to={ROUTES.LOGIN}>
            <Button size="lg">Login</Button>
          </Link>
          <Link to={ROUTES.REGISTER}>
            <Button variant="secondary" size="lg">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
