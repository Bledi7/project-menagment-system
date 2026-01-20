/**
 * Workspace-Based Layout
 * Modern SaaS layout with contextual sidebar and command palette
 */

import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useThemeStore } from '@/theme';
import { CommandPalette, useCommandPalette } from '@/components/ui/CommandPalette';
import { NotificationsCenter } from '@/components/ui/NotificationsCenter';
import { GlobalSearch } from '@/components/ui/GlobalSearch';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceTopbar } from './WorkspaceTopbar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useGlobalShortcuts } from '@/utils/keyboardShortcuts';
import { eventBus, EventCategory } from '@/eventBus';
import { cn } from '@/utils/cn';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  const location = useLocation();
  const { selectedProject } = useProjectStore();
  const { preferences, updatePreference } = usePreferencesStore();
  const { resolvedTheme } = useThemeStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const commandPalette = useCommandPalette();

  useGlobalShortcuts();

  // Subscribe to command palette events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(
      EventCategory.NAVIGATION,
      'command_palette',
      (event) => {
        if (event.payload.type === 'open') {
          commandPalette.open();
        }
      }
    );

    return () => {
      eventBus.unsubscribe(unsubscribe);
    };
  }, [commandPalette]);

  // Subscribe to search events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(EventCategory.SEARCH, 'open', () => {
      setSearchOpen(true);
    });

    return () => {
      eventBus.unsubscribe(unsubscribe);
    };
  }, []);

  // Generate breadcrumbs based on current route
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Home', href: '/' }];

    if (selectedProject) {
      crumbs.push({
        label: selectedProject.title,
        href: `/projects/${selectedProject.key}/${selectedProject.isJiraProject}`,
      });
    }

    const pathParts = location.pathname.split('/').filter(Boolean);
    pathParts.forEach((part, index) => {
      const path = '/' + pathParts.slice(0, index + 1).join('/');
      const label = part
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
      crumbs.push({ label, href: path });
    });

    return crumbs;
  };

  return (
    <div className={cn('flex h-screen overflow-hidden', resolvedTheme === 'dark' && 'dark')}>
      {/* Sidebar */}
      <WorkspaceSidebar
        collapsed={preferences.sidebarCollapsed}
        onToggle={() => updatePreference('sidebarCollapsed', !preferences.sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <WorkspaceTopbar
          onNotificationsClick={() => setNotificationsOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onCommandPaletteClick={() => commandPalette.open()}
        />

        {/* Breadcrumbs */}
        {location.pathname !== '/' && (
          <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Breadcrumbs items={getBreadcrumbs()} />
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Global Components */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
      />
      <NotificationsCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <GlobalSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};
