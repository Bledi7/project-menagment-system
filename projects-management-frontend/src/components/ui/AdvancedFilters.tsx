/**
 * Advanced Filters Component
 * Filter system with saved views
 */

import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Tag } from './Tag';
import { Dropdown } from './Dropdown';
import { cn } from '@/utils/cn';
import type { Card as TaskCard } from '@/types';

export interface FilterConfig {
  status?: TaskCard['status'];
  assignedTo?: number[];
  projectId?: number;
  sprintId?: number;
  search?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export interface SavedView {
  id: string;
  name: string;
  filters: FilterConfig;
  isDefault?: boolean;
}

export interface AdvancedFiltersProps {
  onFilterChange?: (filters: FilterConfig) => void;
  savedViews?: SavedView[];
  onSaveView?: (view: SavedView) => void;
  onDeleteView?: (viewId: string) => void;
  className?: string;
}

export const AdvancedFilters = ({
  onFilterChange,
  savedViews = [],
  onSaveView,
  onDeleteView,
  className,
}: AdvancedFiltersProps) => {
  const { filters, setFilters, clearFilters } = useTaskStore();
  const { preferences, updatePreference } = usePreferencesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskCard['status'][]>(
    filters.status ? [filters.status as TaskCard['status']] : []
  );
  const [viewName, setViewName] = useState('');

  const STATUS_OPTIONS: Array<{ value: TaskCard['status']; label: string }> = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const handleStatusToggle = (status: TaskCard['status']) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    setSelectedStatuses(newStatuses);
    const newStatus = newStatuses.length === 1 ? newStatuses[0] : undefined;
    const updatedFilters: FilterConfig = { ...filters, status: newStatus };
    setFilters({ status: newStatus });
    onFilterChange?.(updatedFilters);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    clearFilters();
    setSearchQuery('');
    onFilterChange?.({});
  };

  const handleSaveView = () => {
    if (!viewName.trim()) return;

    const newView: SavedView = {
      id: `view_${Date.now()}`,
      name: viewName.trim(),
      filters: {
        status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
        search: searchQuery || undefined,
        assignedTo: filters.assignedTo,
        projectId: filters.projectId,
        sprintId: filters.sprintId,
      },
    };

    const currentViews = Array.isArray(preferences.savedViews) 
      ? (preferences.savedViews as SavedView[])
      : [];
    const updatedViews = [...currentViews, newView];
    updatePreference('savedViews', updatedViews as unknown as Record<string, unknown>);
    onSaveView?.(newView);
    setViewName('');
  };

  const handleLoadView = (view: SavedView) => {
    setSelectedStatuses(view.filters.status ? [view.filters.status as TaskCard['status']] : []);
    setSearchQuery(view.filters.search || '');
    setFilters(view.filters);
    onFilterChange?.(view.filters);
  };

  const hasActiveFilters = selectedStatuses.length > 0 || searchQuery.trim() !== '';

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2">
        <Button
          variant={hasActiveFilters ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          }
        >
          Filters
          {hasActiveFilters && (
            <Tag variant="primary" size="sm" className="ml-1">
              {selectedStatuses.length + (searchQuery ? 1 : 0)}
            </Tag>
          )}
        </Button>

        {savedViews.length > 0 && (
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm">
                Saved Views
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            }
            items={[
              ...savedViews.map((view) => ({
                id: view.id,
                label: view.name,
                onClick: () => handleLoadView(view),
              })),
              { id: 'divider', label: '', divider: true, onClick: () => {} },
              ...(savedViews.length > 0
                ? savedViews.map((view) => ({
                    id: `delete-${view.id}`,
                    label: `Delete "${view.name}"`,
                    danger: true,
                    onClick: () => onDeleteView?.(view.id),
                  }))
                : []),
            ]}
          />
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 w-80 z-50 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  const updatedFilters: FilterConfig = { 
                    ...filters, 
                    search: e.target.value || undefined 
                  };
                  onFilterChange?.(updatedFilters);
                }}
                placeholder="Search tasks..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusToggle(option.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                      selectedStatuses.includes(option.value)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                fullWidth
              >
                Clear All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsOpen(false)}
                fullWidth
              >
                Apply
              </Button>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Save View
              </label>
              <div className="flex gap-2">
                <Input
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="View name"
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveView}
                  disabled={!viewName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
