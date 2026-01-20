/**
 * Enhanced Pie Chart Component
 * Real-time updates via Event Bus
 */

import { useState, useEffect } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEventBus, EventCategory } from '@/eventBus/hooks';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartData[];
  title?: string;
  description?: string;
  colors?: string[];
  height?: number;
  loading?: boolean;
  autoRefresh?: boolean;
  refreshEvent?: string;
  className?: string;
}

const DEFAULT_COLORS = [
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
];

export const PieChart = ({
  data,
  title,
  description,
  colors = DEFAULT_COLORS,
  height = 400,
  loading = false,
  autoRefresh = false,
  refreshEvent,
  className,
}: PieChartProps) => {
  const [chartData, setChartData] = useState<PieChartData[]>(data);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  useEventBus(
    EventCategory.TASK,
    refreshEvent || '*',
    () => {
      if (autoRefresh) {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 500);
      }
    },
    [autoRefresh, refreshEvent]
  );

  if (loading) {
    return (
      <Card className={className}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
        <Skeleton variant="circular" width={height} height={height} />
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn('w-full', isRefreshing && 'opacity-75 transition-opacity')}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={height / 3}
              fill="#8884d8"
              dataKey="value"
              animationDuration={300}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
