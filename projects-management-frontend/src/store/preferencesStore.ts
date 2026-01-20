/**
 * User Preferences Store
 * Stores user preferences for UI customization
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  compactMode: boolean;
  density: 'comfortable' | 'compact' | 'spacious';
  savedFilters: Record<string, unknown>;
  savedViews: Record<string, unknown>;
  keyboardShortcuts: Record<string, string>;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

interface PreferencesStore {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  sidebarCollapsed: false,
  sidebarWidth: 256,
  compactMode: false,
  density: 'comfortable',
  savedFilters: {},
  savedViews: {},
  keyboardShortcuts: {},
  notifications: {
    email: true,
    push: true,
    desktop: true,
  },
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,

      updatePreference: (key, value) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        }));
      },

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...updates,
          },
        }));
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },
    }),
    {
      name: 'preferences-storage',
    }
  )
);
