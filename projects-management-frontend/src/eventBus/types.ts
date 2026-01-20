/**
 * Event Bus Type Definitions
 * Centralized pub/sub system for cross-app communication
 */

// Event Categories
export enum EventCategory {
  // UI Events
  TOAST = 'toast',
  MODAL = 'modal',
  LOADING = 'loading',
  NOTIFICATION = 'notification',
  
  // Data Events
  PROJECT = 'project',
  TASK = 'task',
  SPRINT = 'sprint',
  TEAM = 'team',
  USER = 'user',
  REPORT = 'report',
  CONVERSATION = 'conversation',
  MESSAGE = 'message',
  
  // Real-time Events
  SOCKET = 'socket',
  PRESENCE = 'presence',
  TYPING = 'typing',
  
  // Navigation Events
  NAVIGATION = 'navigation',
  SEARCH = 'search',
  
  // Activity & Audit
  ACTIVITY = 'activity',
  AUDIT = 'audit',
  
  // System Events
  THEME = 'theme',
  PREFERENCES = 'preferences',
  ERROR = 'error',
}

// Toast Events
export interface ToastEvent {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Notification Events
export interface NotificationEvent {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// Project Events
export interface ProjectEvent {
  type: 'created' | 'updated' | 'deleted' | 'selected' | 'archived';
  projectId: number;
  project?: unknown;
  userId?: number;
}

// Task/Card Events
export interface TaskEvent {
  type: 'created' | 'updated' | 'deleted' | 'moved' | 'status_changed' | 'assigned';
  taskId: number;
  projectId?: number;
  sprintId?: number;
  task?: unknown;
  userId?: number;
  previousStatus?: string;
  newStatus?: string;
}

// Sprint Events
export interface SprintEvent {
  type: 'created' | 'updated' | 'deleted' | 'started' | 'completed';
  sprintId: number;
  projectId?: number;
  sprint?: unknown;
  userId?: number;
}

// Team Events
export interface TeamEvent {
  type: 'created' | 'updated' | 'deleted' | 'member_added' | 'member_removed';
  teamId: number;
  team?: unknown;
  userId?: number;
  memberId?: number;
}

// User Events
export interface UserEvent {
  type: 'created' | 'updated' | 'deleted' | 'status_changed' | 'role_changed';
  userId: number;
  user?: unknown;
  previousRole?: string;
  newRole?: string;
}

// Presence Events
export interface PresenceEvent {
  type: 'online' | 'offline' | 'away' | 'typing' | 'viewing';
  userId: number;
  projectId?: number;
  taskId?: number;
  metadata?: Record<string, unknown>;
}

// Navigation Events
export interface NavigationEvent {
  type: 'navigate' | 'back' | 'forward';
  path: string;
  params?: Record<string, string>;
}

// Search Events
export interface SearchEvent {
  query: string;
  category?: 'all' | 'projects' | 'tasks' | 'users';
  results?: unknown[];
}

// Activity Events
export interface ActivityEvent {
  type: string;
  userId: number;
  entityType: 'project' | 'task' | 'sprint' | 'team' | 'user';
  entityId: number;
  action: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// Loading Events
export interface LoadingEvent {
  id: string;
  isLoading: boolean;
  message?: string;
}

// Modal Events
export interface ModalEvent {
  id: string;
  type: 'open' | 'close';
  component?: string;
  props?: Record<string, unknown>;
}

// Theme Events
export interface ThemeEvent {
  theme: 'light' | 'dark' | 'system';
}

// Error Events
export interface ErrorEvent {
  error: Error | string;
  context?: string;
  metadata?: Record<string, unknown>;
}

// Union type for all events
export type EventPayload =
  | ToastEvent
  | NotificationEvent
  | ProjectEvent
  | TaskEvent
  | SprintEvent
  | TeamEvent
  | UserEvent
  | PresenceEvent
  | NavigationEvent
  | SearchEvent
  | ActivityEvent
  | LoadingEvent
  | ModalEvent
  | ThemeEvent
  | ErrorEvent
  | Record<string, unknown>;

// Event structure
export interface AppEvent<T extends EventPayload = EventPayload> {
  category: EventCategory;
  type: string;
  payload: T;
  timestamp: Date;
  source?: string;
  metadata?: Record<string, unknown>;
}

// Event handler type
export type EventHandler<T extends EventPayload = EventPayload> = (
  event: AppEvent<T>
) => void | Promise<void>;

// Event subscription
export interface EventSubscription {
  id: string;
  category?: EventCategory;
  type?: string;
  handler: EventHandler;
  once?: boolean;
}
