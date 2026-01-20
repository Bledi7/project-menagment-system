/**
 * Enhanced Socket Hook with Event Bus Integration
 * Typed Socket.io connection with real-time event routing
 */

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/utils/api';
import { useAuthStore } from '@/store';
import { eventBus, EventCategory } from '@/eventBus';
import type { SocketMessage } from '@/types';

interface SocketEvents {
  getMessage: (data: SocketMessage) => void;
  getUsers: (users: unknown[]) => void;
  messageSent: (message: unknown) => void;
  notification: (notification: unknown) => void;
  taskUpdated: (task: unknown) => void;
  projectUpdated: (project: unknown) => void;
  sprintUpdated: (sprint: unknown) => void;
  userPresence: (data: { userId: number; status: 'online' | 'offline' | 'away' }) => void;
  typing: (data: { userId: number; conversationId: number; isTyping: boolean }) => void;
}

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    if (!user || !accessToken) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: {
        token: accessToken,
      },
    });

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      eventBus.emit(EventCategory.SOCKET, 'connected', {});
      socketRef.current?.emit('addUser', { userId: user.id });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      eventBus.emit(EventCategory.SOCKET, 'disconnected', {});
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      eventBus.emit(EventCategory.ERROR, 'error', {
        error: error.message || 'Socket connection failed',
        context: 'socket',
      });
    });

    // Message events
    socketRef.current.on('getMessage', (data: SocketMessage) => {
      eventBus.emit(EventCategory.MESSAGE, 'received', {
        message: data,
        conversationId: data.conversationId,
      });
    });

    socketRef.current.on('messageSent', (message: unknown) => {
      eventBus.emit(EventCategory.MESSAGE, 'sent', { message });
    });

    // Notification events
    socketRef.current.on('notification', (notification: unknown) => {
      eventBus.emit(EventCategory.NOTIFICATION, 'new', {
        id: `socket_${Date.now()}`,
        type: 'info',
        title: 'New notification',
        timestamp: new Date(),
        read: false,
        metadata: { notification },
      });
    });

    // Task events
    socketRef.current.on('taskUpdated', (task: unknown) => {
      eventBus.emit(EventCategory.TASK, 'updated', {
        task,
        source: 'socket',
      });
    });

    // Project events
    socketRef.current.on('projectUpdated', (project: unknown) => {
      eventBus.emit(EventCategory.PROJECT, 'updated', {
        project,
        source: 'socket',
      });
    });

    // Sprint events
    socketRef.current.on('sprintUpdated', (sprint: unknown) => {
      eventBus.emit(EventCategory.SPRINT, 'updated', {
        sprint,
        source: 'socket',
      });
    });

    // Presence events
    socketRef.current.on('userPresence', (data: { userId: number; status: 'online' | 'offline' | 'away' }) => {
      eventBus.emit(EventCategory.PRESENCE, data.status, {
        userId: data.userId,
        status: data.status,
      });
    });

    // Typing indicators
    socketRef.current.on('typing', (data: { userId: number; conversationId: number; isTyping: boolean }) => {
      eventBus.emit(EventCategory.TYPING, data.isTyping ? 'start' : 'stop', {
        userId: data.userId,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
    });

    // Listen for logout/disconnect events from Event Bus
    const unsubscribe = eventBus.subscribe(
      EventCategory.SOCKET,
      'disconnect',
      () => {
        if (socketRef.current?.connected) {
          socketRef.current.disconnect();
        }
      }
    );

    // Cleanup on unmount
    return () => {
      eventBus.unsubscribe(unsubscribe);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, accessToken]);

  const emit = useCallback((event: string, data: unknown) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn(`Socket not connected. Cannot emit event: ${event}`);
    }
  }, []);

  const on = useCallback(<K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback as (...args: unknown[]) => void);
    }
  }, []);

  const off = useCallback(<K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback as (...args: unknown[]) => void);
    }
  }, []);

  const joinRoom = useCallback((room: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('joinRoom', room);
    }
  }, []);

  const leaveRoom = useCallback((room: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leaveRoom', room);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
  };
};
