/**
 * Enhanced Notification Store with Event Bus Integration
 */

import { create } from 'zustand';
import { eventBus, EventCategory } from '@/eventBus';
import type { NotificationEvent } from '@/eventBus/types';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 100), // Keep last 100
      unreadCount: state.unreadCount + 1,
    }));

    // Emit event for real-time updates
    eventBus.emit(EventCategory.NOTIFICATION, 'new', {
      id: newNotification.id,
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      timestamp: newNotification.timestamp,
      read: false,
      actionUrl: newNotification.actionUrl,
      metadata: newNotification.metadata,
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const wasUnread = !state.notifications.find((n) => n.id === id)?.read;
      return {
        notifications: updated,
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      const wasUnread = notification && !notification.read;
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: wasUnread
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    });
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

// Subscribe to Event Bus notifications
if (typeof window !== 'undefined') {
  eventBus.subscribe(EventCategory.NOTIFICATION, 'new', (event) => {
    const payload = event.payload as NotificationEvent;
    useNotificationStore.getState().addNotification({
      type: payload.type,
      title: payload.title,
      message: payload.message,
      actionUrl: payload.actionUrl,
      metadata: payload.metadata,
    });
  });
}
