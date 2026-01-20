/**
 * Workspace Sidebar
 * Contextual sidebar that changes based on selected project
 */

import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { useLogout } from '@/hooks/useAuth';
import { ROUTES, ROLES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { Tooltip } from '@/components/ui/Tooltip';
import { Dropdown } from '@/components/ui/Dropdown';
import { eventBus, EventCategory } from '@/eventBus';

interface WorkspaceSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  path?: string;
  action?: () => void;
  roles?: string[];
  badge?: number;
  children?: SidebarItem[];
}

export const WorkspaceSidebar = ({ collapsed, onToggle }: WorkspaceSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, selectedProject, recentProjects, pinnedProjects, setSelectedProject } =
    useProjectStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main']));
  const logout = useLogout();

  // Listen for logout events from Event Bus
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(
      EventCategory.NAVIGATION,
      'logout',
      () => {
        logout.mutate();
      }
    );

    return () => {
      eventBus.unsubscribe(unsubscribe);
    };
  }, [logout]);

  // Main navigation items
  const mainItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      path: ROUTES.HOME,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      path: ROUTES.PROJECTS,
      roles: [ROLES.PRODUCT_OWNER],
    },
    {
      id: 'sprints',
      label: 'Sprints',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      path: ROUTES.SPRINTS,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      path: ROUTES.REPORTS,
      roles: [ROLES.PRODUCT_OWNER],
    },
    {
      id: 'team',
      label: 'Team',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      path: ROUTES.TEAM,
      roles: [ROLES.SCRUM_MASTER],
    },
  ];

  // Filter items by role
  const filteredItems = mainItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const renderItem = (item: SidebarItem, depth = 0) => {
    const isActive = item.path && location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections.has(item.id);

    const content = (
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group',
          isActive
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
          depth > 0 && 'ml-4'
        )}
        onClick={() => {
          if (item.action) {
            item.action();
          } else if (item.path) {
            navigate(item.path);
          } else if (hasChildren) {
            toggleSection(item.id);
          }
        }}
      >
        <span className={cn('flex-shrink-0', collapsed && 'mx-auto')}>
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 font-medium">{item.label}</span>
            {item.badge && (
              <Tag variant="primary" size="sm">
                {item.badge}
              </Tag>
            )}
            {hasChildren && (
              <svg
                className={cn(
                  'w-4 h-4 transition-transform',
                  isExpanded && 'rotate-90'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </>
        )}
      </div>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.id} content={item.label} placement="right">
          {content}
        </Tooltip>
      );
    }

    return (
      <div key={item.id}>
        {content}
        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            PM System
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
              d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" style={{ overflowX: 'visible' }}>
        {/* Main Items */}
        <div className="space-y-1 mb-4">
          {filteredItems.map((item) => renderItem(item))}
        </div>

        {/* Pinned Projects */}
        {!collapsed && pinnedProjects.length > 0 && (
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Pinned
            </div>
            <div className="space-y-1">
              {projects
                .filter((p) => pinnedProjects.includes(p.id))
                .map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.key}/${project.isJiraProject}`}
                    onClick={() => setSelectedProject(project)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      selectedProject?.id === project.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span className="flex-1 truncate">{project.title}</span>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Recent Projects */}
        {!collapsed && recentProjects.length > 0 && (
          <div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Recent
            </div>
            <div className="space-y-1">
              {recentProjects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.key}/${project.isJiraProject}`}
                  onClick={() => setSelectedProject(project)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span className="flex-1 truncate">{project.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      {user && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 relative z-10">
          <Dropdown
            trigger={
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <Avatar
                  src={user.profileImagePath || undefined}
                  name={`${user.firstName} ${user.lastName}`}
                  size="sm"
                  showStatus
                  status="online"
                />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.role}
                    </div>
                  </div>
                )}
                {!collapsed && (
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            }
            items={[
              {
                id: 'profile',
                label: 'Profile',
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                ),
                onClick: () => navigate(ROUTES.PROFILE),
              },
              {
                id: 'settings',
                label: 'Settings',
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
                onClick: () => {
                  eventBus.emit(EventCategory.PREFERENCES, 'open', {});
                },
              },
              { id: 'divider', label: '', divider: true, onClick: () => {} },
              {
                id: 'logout',
                label: 'Logout',
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                ),
                danger: true,
                onClick: () => {
                  logout.mutate();
                },
              },
            ]}
          />
        </div>
      )}
    </aside>
  );
};
