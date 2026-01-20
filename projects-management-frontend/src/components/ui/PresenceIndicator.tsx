/**
 * Presence Indicator Component
 * Shows online/offline/typing status for users
 */

import { useState, useEffect } from 'react';
import { useEventBus, EventCategory } from '@/eventBus/hooks';
import { Avatar } from './Avatar';
import { Tag } from './Tag';
import { cn } from '@/utils/cn';
import type { PresenceEvent } from '@/eventBus/types';

export interface UserPresence {
  userId: number;
  status: 'online' | 'offline' | 'away' | 'busy';
  isTyping?: boolean;
  lastSeen?: Date;
  metadata?: Record<string, unknown>;
}

export interface PresenceIndicatorProps {
  userId: number;
  userName: string;
  userAvatar?: string;
  showLabel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const PresenceIndicator = ({
  userId,
  userName,
  userAvatar,
  showLabel = false,
  size = 'md',
  className,
}: PresenceIndicatorProps) => {
  const [presence, setPresence] = useState<UserPresence>({
    userId,
    status: 'offline',
  });

  // Subscribe to presence events
  useEventBus<PresenceEvent>(
    EventCategory.PRESENCE,
    '*',
    (event) => {
      if (event.payload.userId === userId) {
        setPresence((prev) => ({
          ...prev,
          status: event.payload.type as UserPresence['status'],
          metadata: event.payload.metadata,
        }));
      }
    }
  );

  // Subscribe to typing events
  useEventBus(
    EventCategory.TYPING,
    '*',
    (event) => {
      const payload = event.payload as { userId: number; isTyping: boolean };
      if (payload.userId === userId) {
        setPresence((prev) => ({
          ...prev,
          isTyping: payload.isTyping,
        }));
      }
    }
  );

  const getStatusColor = (status: UserPresence['status']): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Avatar
          src={userAvatar}
          name={userName}
          size={size}
          showStatus
          status={presence.status}
        />
        {presence.isTyping && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-xs">✎</span>
          </div>
        )}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {userName}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                getStatusColor(presence.status)
              )}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {presence.isTyping
                ? 'typing...'
                : presence.status === 'online'
                ? 'Online'
                : presence.status === 'away'
                ? 'Away'
                : presence.status === 'busy'
                ? 'Busy'
                : 'Offline'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Multi-User Presence List
 */
export interface PresenceListProps {
  users: Array<{
    id: number;
    name: string;
    avatar?: string;
  }>;
  maxVisible?: number;
  className?: string;
}

export const PresenceList = ({
  users,
  maxVisible = 5,
  className,
}: PresenceListProps) => {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex -space-x-2">
        {visibleUsers.map((user) => (
          <PresenceIndicator
            key={user.id}
            userId={user.id}
            userName={user.name}
            userAvatar={user.avatar}
            size="sm"
          />
        ))}
      </div>
      {remainingCount > 0 && (
        <Tag variant="default" size="sm">
          +{remainingCount}
        </Tag>
      )}
    </div>
  );
};
