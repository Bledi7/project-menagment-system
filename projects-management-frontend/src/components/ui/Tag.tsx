/**
 * Tag Component
 * Modern tag/badge component for labels and status
 */

import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Tag = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  leftIcon,
  rightIcon,
  className,
  ...props
}: TagProps) => {
  const variants = {
    default:
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    primary:
      'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    success:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger:
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    info:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 transition-opacity"
          aria-label="Remove tag"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
