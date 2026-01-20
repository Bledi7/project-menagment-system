/**
 * Skeleton Loader Component
 * Loading placeholders for better UX
 */

import { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props
}: SkeletonProps) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variants[variant],
        animations[animation],
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : '100%'),
        height: height || (variant === 'text' ? '1em' : variant === 'circular' ? width : 'auto'),
        ...style,
      }}
      {...props}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText = ({
  lines = 1,
  className,
  ...props
}: { lines?: number } & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '80%' : '100%'}
        {...props}
      />
    ))}
  </div>
);

export const SkeletonCard = (props: HTMLAttributes<HTMLDivElement>) => (
  <div className="p-6 space-y-4" {...props}>
    <Skeleton variant="rounded" height={24} width="60%" />
    <SkeletonText lines={3} />
    <div className="flex gap-2">
      <Skeleton variant="rounded" height={32} width={100} />
      <Skeleton variant="rounded" height={32} width={100} />
    </div>
  </div>
);

export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  ...props
}: { rows?: number; columns?: number } & HTMLAttributes<HTMLDivElement>) => (
  <div className="space-y-2" {...props}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} variant="rounded" height={40} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);
