/**
 * Table Component
 * Modern data table with sorting and selection
 */

import { ReactNode, HTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (value: unknown, row: T, index: number) => ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableProps<T = unknown> extends HTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: Set<string | number>;
  onRowSelect?: (row: T, index: number, selected: boolean) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor = (_, index) => index,
  onRowClick,
  selectedRows,
  onRowSelect,
  emptyMessage = 'No data available',
  loading = false,
  className,
  ...props
}: TableProps<T>) {
  const getValue = (row: T, key: string): unknown => {
    return key.split('.').reduce((obj, k) => (obj as Record<string, unknown>)?.[k], row);
  };

  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse bg-white dark:bg-gray-800',
          className
        )}
        {...props}
      >
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {onRowSelect && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  onChange={(e) => {
                    // Handle select all
                  }}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = keyExtractor(row, index);
              const isSelected = selectedRows?.has(key);

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, index)}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50',
                    isSelected && 'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  {onRowSelect && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onRowSelect(row, index, e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = getValue(row, column.key);
                    return (
                      <td
                        key={column.key}
                        className={cn(
                          'px-4 py-3 text-sm text-gray-900 dark:text-gray-100',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right'
                        )}
                      >
                        {column.render
                          ? column.render(value, row, index)
                          : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
