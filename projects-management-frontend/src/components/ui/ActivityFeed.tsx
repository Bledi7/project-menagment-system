/**
 * Activity Feed Component
 * Real-time activity feed with Event Bus integration
 */

import { useState } from 'react';
import { useEventBus, EventCategory } from '@/eventBus/hooks';
import { formatDistanceToNow } from 'date-fns';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Tag } from './Tag';
import { cn } from '@/utils/cn';
import type { ActivityEvent } from '@/eventBus/types';

export interface Activity {
  id: string;
  type: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  entityType: 'project' | 'task' | 'sprint' | 'team' | 'user';
  entityId: number;
  entityName: string;
  action: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ActivityFeedProps {
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export const ActivityFeed = ({
  limit = 50,
  showFilters = false,
  className,
}: ActivityFeedProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | Activity['entityType']>('all');

  // Subscribe to activity events
  useEventBus<ActivityEvent>(EventCategory.ACTIVITY, '*', (event) => {
    const payload = event.payload as ActivityEvent;
    
    // Transform event to activity
    const activity: Activity = {
      id: `activity_${Date.now()}_${Math.random()}`,
      type: payload.type,
      userId: payload.userId,
      userName: 'User', // Would come from user store
      entityType: payload.entityType,
      entityId: payload.entityId,
      entityName: String(payload.entityId),
      action: payload.action,
      description: getActivityDescription(payload),
      timestamp: payload.timestamp,
      metadata: payload.metadata,
    };

    setActivities((prev) => [activity, ...prev].slice(0, limit));
  });

  const getActivityDescription = (event: ActivityEvent): string => {
    const actions: Record<string, string> = {
      created: 'created',
      updated: 'updated',
      deleted: 'deleted',
      assigned: 'assigned',
      completed: 'completed',
      started: 'started',
    };

    const action = actions[event.action] || event.action;
    return `${action} ${event.entityType} ${event.entityId}`;
  };

  const getActivityIcon = (entityType: Activity['entityType']) => {
    const icons = {
      project: '📁',
      task: '✅',
      sprint: '🏃',
      team: '👥',
      user: '👤',
    };
    return icons[entityType];
  };

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter((a) => a.entityType === filter);

  return (
    <Card className={cn('', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Feed
        </h3>
        {showFilters && (
          <div className="flex gap-2">
            {(['all', 'project', 'task', 'sprint', 'team', 'user'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  'px-3 py-1 text-sm rounded-lg transition-colors',
                  filter === type
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No activities yet
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Avatar
                src={activity.userAvatar}
                name={activity.userName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {activity.userName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{getActivityIcon(activity.entityType)}</span>
                  <Tag variant="default" size="sm">
                    {activity.entityType}
                  </Tag>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
