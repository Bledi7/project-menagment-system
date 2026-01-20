/**
 * Global Search Component
 * Search across projects, tasks, and users
 */

import { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { useProjects } from '@/hooks/useProjects';
import { useUsers } from '@/hooks/useUsers';
import { useCards } from '@/hooks/useCards';
import { Skeleton } from './Skeleton';

export interface SearchResult {
  id: string;
  type: 'project' | 'task' | 'user';
  title: string;
  description?: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: projects } = useProjects();
  const { data: users } = useUsers();
  const { data: cards } = useCards();

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchLower = query.toLowerCase();

    const searchResults: SearchResult[] = [];

    // Search projects
    if (projects && Array.isArray(projects)) {
      projects.forEach((project) => {
        if (
          project.title.toLowerCase().includes(searchLower) ||
          project.key?.toLowerCase().includes(searchLower)
        ) {
          searchResults.push({
            id: `project-${project.id}`,
            type: 'project',
            title: project.title,
            description: `Project • ${project.key || 'No key'}`,
            url: `/projects/${project.key}/${project.isJiraProject}`,
            metadata: { project },
          });
        }
      });
    }

    // Search tasks/cards
    if (cards) {
      cards.forEach((card) => {
        if (
          card.title?.toLowerCase().includes(searchLower) ||
          card.description?.toLowerCase().includes(searchLower)
        ) {
          searchResults.push({
            id: `task-${card.id}`,
            type: 'task',
            title: card.title || 'Untitled Task',
            description: `Task • ${card.status || 'No status'}`,
            url: `/tasks/${card.id}`,
            metadata: { card },
          });
        }
      });
    }

    // Search users
    if (users) {
      users.forEach((user) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        if (
          fullName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        ) {
          searchResults.push({
            id: `user-${user.id}`,
            type: 'user',
            title: fullName,
            description: `${user.role} • ${user.email}`,
            url: `/users/${user.id}`,
            metadata: { user },
          });
        }
      });
    }

    setResults(searchResults);
    setIsSearching(false);
    setSelectedIndex(0);
  }, [query, projects, users, cards]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          navigate(selectedResult.url);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('keydown', handleKeyDown as unknown as EventListener);
      input.focus();
    }

    return () => {
      if (input) {
        input.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
      }
    };
  }, [isOpen, results, selectedIndex, navigate, onClose]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        );
      case 'task':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

      {/* Search Modal */}
      <div
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, users..."
            className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
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
          )}
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 space-y-3">
              <Skeleton variant="rounded" height={60} />
              <Skeleton variant="rounded" height={60} />
              <Skeleton variant="rounded" height={60} />
            </div>
          ) : query && results.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <p>No results found for "{query}"</p>
            </div>
          ) : !query ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <p>Start typing to search...</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  data-index={index}
                  onClick={() => {
                    navigate(result.url);
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    index === selectedIndex
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  )}
                >
                  <div className="flex-shrink-0">{getTypeIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {result.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
