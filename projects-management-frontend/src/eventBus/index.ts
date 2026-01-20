/**
 * Event Bus Implementation
 * Centralized pub/sub system for cross-app communication
 */

import mitt, { Emitter } from 'mitt';
import { EventCategory } from './types';
import type {
  AppEvent,
  EventPayload,
  EventHandler,
  EventSubscription,
} from './types';

class EventBus {
  private emitter: Emitter<Record<string, AppEvent>>;
  private subscriptions: Map<string, EventSubscription>;
  private subscriptionCounter: number;

  constructor() {
    this.emitter = mitt<Record<string, AppEvent>>();
    this.subscriptions = new Map();
    this.subscriptionCounter = 0;
  }

  /**
   * Subscribe to events
   */
  subscribe<T extends EventPayload = EventPayload>(
    category: EventCategory,
    type: string,
    handler: EventHandler<T>,
    options?: { once?: boolean }
  ): string {
    const id = `sub_${++this.subscriptionCounter}_${Date.now()}`;
    const eventKey = `${category}:${type}`;

    const subscription: EventSubscription = {
      id,
      category,
      type,
      handler: handler as EventHandler,
      once: options?.once,
    };

    this.subscriptions.set(id, subscription);

    const wrappedHandler = (event: AppEvent<T>) => {
      handler(event);
      if (options?.once) {
        this.unsubscribe(id);
      }
    };

    this.emitter.on(eventKey, wrappedHandler as (event: AppEvent) => void);

    return id;
  }

  /**
   * Subscribe to all events in a category
   */
  subscribeToCategory<T extends EventPayload = EventPayload>(
    category: EventCategory,
    handler: EventHandler<T>
  ): string {
    const id = `sub_${++this.subscriptionCounter}_${Date.now()}`;

    const subscription: EventSubscription = {
      id,
      category,
      handler: handler as EventHandler,
    };

    this.subscriptions.set(id, subscription);

    const wrappedHandler = (event: AppEvent<T>) => {
      if (event.category === category) {
        handler(event);
      }
    };

    // Subscribe to all possible event keys in this category
    Object.values(EventCategory).forEach((cat) => {
      if (cat === category) {
        // We'll handle this differently - listen to all events and filter
        this.emitter.on('*', wrappedHandler as (event: AppEvent) => void);
      }
    });

    return id;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return;

    const eventKey = subscription.type
      ? `${subscription.category}:${subscription.type}`
      : undefined;

    if (eventKey) {
      this.emitter.off(eventKey, subscription.handler as (event: AppEvent) => void);
    }

    this.subscriptions.delete(subscriptionId);
  }

  /**
   * Emit an event
   */
  emit<T extends EventPayload = EventPayload>(
    category: EventCategory,
    type: string,
    payload: T,
    metadata?: Record<string, unknown>
  ): void {
    const event: AppEvent<T> = {
      category,
      type,
      payload,
      timestamp: new Date(),
      metadata,
    };

    const eventKey = `${category}:${type}`;
    this.emitter.emit(eventKey, event);

    // Also emit to wildcard listeners
    this.emitter.emit('*', event);
  }

  /**
   * Emit an event asynchronously
   */
  async emitAsync<T extends EventPayload = EventPayload>(
    category: EventCategory,
    type: string,
    payload: T,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    return new Promise((resolve) => {
      this.emit(category, type, payload, metadata);
      // Use setTimeout to ensure handlers are called
      setTimeout(resolve, 0);
    });
  }

  /**
   * Get all active subscriptions
   */
  getSubscriptions(): EventSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  /**
   * Clear all subscriptions
   */
  clear(): void {
    this.subscriptions.forEach((sub) => {
      this.unsubscribe(sub.id);
    });
    this.subscriptions.clear();
  }

  /**
   * Check if there are any subscriptions
   */
  hasSubscriptions(): boolean {
    return this.subscriptions.size > 0;
  }
}

// Create singleton instance
export const eventBus = new EventBus();

// Convenience functions for common events
export const emitToast = (
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  duration?: number
) => {
  eventBus.emit(EventCategory.TOAST, 'show', {
    type,
    message,
    duration,
  });
};

export const emitNotification = (
  type: 'info' | 'success' | 'warning' | 'error',
  title: string,
  message?: string,
  metadata?: Record<string, unknown>
) => {
  eventBus.emit(EventCategory.NOTIFICATION, 'new', {
    id: `notif_${Date.now()}_${Math.random()}`,
    type,
    title,
    message,
    timestamp: new Date(),
    read: false,
    metadata,
  });
};

export const emitProjectEvent = (
  type: 'created' | 'updated' | 'deleted' | 'selected' | 'archived',
  projectId: number,
  project?: unknown,
  userId?: number
) => {
  eventBus.emit(EventCategory.PROJECT, type, {
    type,
    projectId,
    project,
    userId,
  });
};

export const emitTaskEvent = (
  type: 'created' | 'updated' | 'deleted' | 'moved' | 'status_changed' | 'assigned',
  taskId: number,
  projectId?: number,
  sprintId?: number,
  task?: unknown,
  userId?: number
) => {
  eventBus.emit(EventCategory.TASK, type, {
    type,
    taskId,
    projectId,
    sprintId,
    task,
    userId,
  });
};

export const emitSprintEvent = (
  type: 'created' | 'updated' | 'deleted' | 'started' | 'completed',
  sprintId: number,
  projectId?: number,
  sprint?: unknown,
  userId?: number
) => {
  eventBus.emit(EventCategory.SPRINT, type, {
    type,
    sprintId,
    projectId,
    sprint,
    userId,
  });
};

export const emitLoading = (id: string, isLoading: boolean, message?: string) => {
  eventBus.emit(EventCategory.LOADING, isLoading ? 'start' : 'stop', {
    id,
    isLoading,
    message,
  });
};

export const emitError = (error: Error | string, context?: string, metadata?: Record<string, unknown>) => {
  eventBus.emit(EventCategory.ERROR, 'error', {
    error,
    context,
    metadata,
  });
};

export { EventCategory } from './types';
export type { AppEvent, EventPayload, EventHandler, EventSubscription } from './types';
