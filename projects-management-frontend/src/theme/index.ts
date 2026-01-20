/**
 * Theme System
 * Centralized theme management with dark mode support
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { eventBus, EventCategory } from '@/eventBus';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

const applyTheme = (theme: 'light' | 'dark') => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      // Initialize theme on first load
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme-storage');
        let initialTheme: Theme = 'system';
        
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            initialTheme = parsed.state?.theme || 'system';
          } catch {
            // Use system default
          }
        }

        const resolved = resolveTheme(initialTheme);
        applyTheme(resolved);

        // Listen for system theme changes
        if (initialTheme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            const newResolved = getSystemTheme();
            set({ resolvedTheme: newResolved });
            applyTheme(newResolved);
            eventBus.emit(EventCategory.THEME, 'changed', { theme: newResolved });
          };
          mediaQuery.addEventListener('change', handleChange);
        }
      }

      return {
        theme: 'system',
        resolvedTheme: typeof window !== 'undefined' ? getSystemTheme() : 'light',
        setTheme: (theme: Theme) => {
          const resolved = resolveTheme(theme);
          set({ theme, resolvedTheme: resolved });
          applyTheme(resolved);
          eventBus.emit(EventCategory.THEME, 'changed', { theme: resolved });
        },
        toggleTheme: () => {
          const current = get().resolvedTheme;
          const newTheme = current === 'dark' ? 'light' : 'dark';
          set({ theme: newTheme, resolvedTheme: newTheme });
          applyTheme(newTheme);
          eventBus.emit(EventCategory.THEME, 'changed', { theme: newTheme });
        },
      };
    },
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Initialize theme on module load
if (typeof window !== 'undefined') {
  const store = useThemeStore.getState();
  const resolved = resolveTheme(store.theme);
  applyTheme(resolved);
}
