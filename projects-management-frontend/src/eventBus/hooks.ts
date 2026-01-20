/**
 * React Hooks for Event Bus
 */

import { useEffect, useRef } from 'react';
import { eventBus } from './index';
import { EventCategory } from './types';
import type { EventHandler, EventPayload, AppEvent } from './types';

/**
 * Hook to subscribe to events
 */
export function useEventBus<T extends EventPayload = EventPayload>(
  category: EventCategory,
  type: string,
  handler: EventHandler<T>,
  deps: unknown[] = []
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const subscriptionId = eventBus.subscribe(category, type, (event) => {
      handlerRef.current(event as AppEvent<T>);
    });

    return () => {
      eventBus.unsubscribe(subscriptionId);
    };
  }, [category, type, ...deps]);
}

/**
 * Hook to subscribe to all events in a category
 */
export function useEventBusCategory<T extends EventPayload = EventPayload>(
  category: EventCategory,
  handler: EventHandler<T>,
  deps: unknown[] = []
): void {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const subscriptionId = eventBus.subscribeToCategory(category, (event) => {
      handlerRef.current(event as AppEvent<T>);
    });

    return () => {
      eventBus.unsubscribe(subscriptionId);
    };
  }, [category, ...deps]);
}

// Re-export types and EventCategory
export type { AppEvent };
export { EventCategory };
