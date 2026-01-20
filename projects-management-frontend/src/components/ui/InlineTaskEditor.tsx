/**
 * Inline Task Editor Component
 * Edit tasks inline with optimistic updates
 */

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useCards } from '@/hooks/useCards';
import { Card as TaskCard } from '@/types';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Tag } from './Tag';
import { Avatar } from './Avatar';
import { Dropdown } from './Dropdown';
import { cn } from '@/utils/cn';
import { eventBus, EventCategory, emitTaskEvent } from '@/eventBus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCard } from '@/api/cardService';
import { queryKeys } from '@/api/queryKeys';

export interface InlineTaskEditorProps {
  task: TaskCard;
  onSave?: (task: TaskCard) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  className?: string;
}

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', color: 'gray' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'done', label: 'Done', color: 'green' },
] as const;

export const InlineTaskEditor = ({
  task,
  onSave,
  onCancel,
  autoFocus = false,
  className,
}: InlineTaskEditorProps) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<TaskCard['status']>(task.status || 'todo');
  const [isEditing, setIsEditing] = useState(autoFocus);
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { updateTask } = useTaskStore();

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<TaskCard>) => updateCard(task.id, updates),
    onMutate: async (updates) => {
      // Optimistic update
      const previousTask = { ...task };
      const optimisticTask = { ...task, ...updates };
      
      updateTask(task.id, updates);
      emitTaskEvent('updated', task.id, undefined, undefined, optimisticTask);

      return { previousTask };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      updateTask(task.id, data);
      setIsEditing(false);
      onSave?.(data);
      eventBus.emit(EventCategory.TOAST, 'show', {
        type: 'success',
        message: 'Task updated successfully',
      });
    },
    onError: (error, _, context) => {
      // Rollback optimistic update
      if (context?.previousTask) {
        updateTask(task.id, context.previousTask);
      }
      eventBus.emit(EventCategory.ERROR, 'error', {
        error: error instanceof Error ? error.message : 'Failed to update task',
        context: 'inline_task_editor',
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (isEditing && autoFocus && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditing, autoFocus]);

  const handleSave = () => {
    if (!title.trim()) return;

    setIsSaving(true);
    updateMutation.mutate({
      title: title.trim(),
      description: description.trim() || null,
      status,
    });
  };

  const handleCancel = () => {
    setTitle(task.title || '');
    setDescription(task.description || '');
    setStatus(task.status || 'todo');
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status);

  if (!isEditing) {
    return (
      <div
        className={cn(
          'p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors',
          className
        )}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              {task.title || 'Untitled Task'}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <Tag
            variant={
              status === 'done'
                ? 'success'
                : status === 'in_progress'
                ? 'primary'
                : 'default'
            }
            size="sm"
          >
            {currentStatus?.label || status}
          </Tag>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 border-primary-500 dark:border-primary-600 bg-white dark:bg-gray-800 shadow-lg',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        <Input
          ref={titleInputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title"
          className="font-medium"
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task description (optional)"
          rows={3}
        />

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <Dropdown
              trigger={
                <button className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-left w-full flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Tag
                    variant={
                      status === 'done'
                        ? 'success'
                        : status === 'in_progress'
                        ? 'primary'
                        : 'default'
                    }
                    size="sm"
                  >
                    {currentStatus?.label || status}
                  </Tag>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              }
              items={STATUS_OPTIONS.map((option) => ({
                id: option.value,
                label: option.label,
                onClick: () => setStatus(option.value as TaskCard['status']),
              }))}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> to
          cancel, <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">⌘+Enter</kbd>{' '}
          to save
        </p>
      </div>
    </div>
  );
};
