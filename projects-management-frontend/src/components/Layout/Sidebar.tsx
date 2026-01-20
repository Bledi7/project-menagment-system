import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROUTES, ROLES } from '@/utils/constants';
import { cn } from '@/utils/cn';

const menuItems = [
  { path: ROUTES.HOME, label: 'Home', icon: '🏠' },
  { path: ROUTES.PROJECTS, label: 'Projects', icon: '📁', roles: [ROLES.PRODUCT_OWNER] },
  { path: ROUTES.SPRINTS, label: 'Sprints', icon: '🏃' },
  { path: ROUTES.REPORTS, label: 'Reports', icon: '📊', roles: [ROLES.PRODUCT_OWNER] },
  { path: ROUTES.MY_REPORTS, label: 'My Reports', icon: '📝', roles: [ROLES.PRODUCT_OWNER] },
  { path: ROUTES.TEAM, label: 'Team', icon: '👥', roles: [ROLES.SCRUM_MASTER] },
  { path: ROUTES.TEAM_MEMBERS, label: 'Members', icon: '👤' },
  { path: ROUTES.PROFILE, label: 'Profile', icon: '👤' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role as any);
  });

  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        isOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {isOpen && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            PM System
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              {isOpen && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
