/**
 * Keyboard Shortcuts System
 * Global keyboard shortcuts with command palette integration
 */

import { useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventBus, EventCategory } from '@/eventBus';
import { ROUTES } from './constants';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

class KeyboardShortcutsManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled: boolean = true;

  register(shortcut: KeyboardShortcut): () => void {
    const id = this.getShortcutId(shortcut);
    this.shortcuts.set(id, shortcut);

    // Return unregister function
    return () => {
      this.shortcuts.delete(id);
    };
  }

  unregister(id: string): void {
    this.shortcuts.delete(id);
  }

  private getShortcutId(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.ctrl || shortcut.meta) parts.push('mod');
    if (shortcut.shift) parts.push('shift');
    if (shortcut.alt) parts.push('alt');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    const key = event.key.toLowerCase();
    const ctrl = event.ctrlKey || event.metaKey;
    const shift = event.shiftKey;
    const alt = event.altKey;

    // Find matching shortcut
    for (const shortcut of this.shortcuts.values()) {
      const keyMatch = shortcut.key.toLowerCase() === key;
      const ctrlMatch = (shortcut.ctrl || shortcut.meta) === ctrl;
      const shiftMatch = shortcut.shift === shift;
      const altMatch = shortcut.alt === alt;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
        return;
      }
    }
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }
}

// Global instance
export const keyboardShortcutsManager = new KeyboardShortcutsManager();

// Initialize global keyboard listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    keyboardShortcutsManager.handleKeyDown(e);
  });
}

/**
 * Hook to register keyboard shortcuts
 */
export function useKeyboardShortcut(
  shortcut: KeyboardShortcut,
  deps: unknown[] = []
): void {
  useEffect(() => {
    const unregister = keyboardShortcutsManager.register(shortcut);
    return unregister;
  }, deps);
}

/**
 * Hook to register global shortcuts
 */
export function useGlobalShortcuts(): void {
  const navigate = useNavigate();

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        meta: true,
        action: () => {
          eventBus.emit(EventCategory.NAVIGATION, 'command_palette', {
            type: 'open',
          });
        },
        description: 'Open command palette',
        category: 'Navigation',
      },
      {
        key: '/',
        action: () => {
          eventBus.emit(EventCategory.SEARCH, 'open', {});
        },
        description: 'Open search',
        category: 'Navigation',
      },
      {
        key: 'n',
        meta: true,
        action: () => {
          eventBus.emit(EventCategory.PROJECT, 'create', {});
        },
        description: 'Create new project',
        category: 'Actions',
      },
      {
        key: 'h',
        meta: true,
        action: () => {
          navigate(ROUTES.HOME);
        },
        description: 'Go to home',
        category: 'Navigation',
      },
      {
        key: 'p',
        meta: true,
        action: () => {
          navigate(ROUTES.PROJECTS);
        },
        description: 'Go to projects',
        category: 'Navigation',
      },
    ];

    const unregisters = shortcuts.map((shortcut) =>
      keyboardShortcutsManager.register(shortcut)
    );

    return () => {
      unregisters.forEach((unregister) => unregister());
    };
  }, [navigate]);
}
