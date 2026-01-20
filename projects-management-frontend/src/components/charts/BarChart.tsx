/**
 * Enhanced Bar Chart Component
 * Real-time updates via Event Bus
 */

import { useState, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useEventBus, EventCategory } from '@/eventBus/hooks';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface BarChartProps {
  data: BarChartData[];
  dataKey?: string;
  xAxisKey?: string;
  title?: string;
  description?: string;
  colors?: string[];
  height?: number;
  loading?: boolean;
  autoRefresh?: boolean;
  refreshEvent?: string;
  className?: string;
}

export const BarChart = ({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  title,
  description,
  colors = ['#0ea5e9'],
  height = 400,
  loading = false,
  autoRefresh = false,
  refreshEvent,
  className,
}: BarChartProps) => {
  const [chartData, setChartData] = useState<BarChartData[]>(data);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Update chart data when prop changes
  useEffect(() => {
    setChartData(data);
  }, [data]);

  // Subscribe to refresh events if autoRefresh is enabled
  useEventBus(
    EventCategory.TASK,
    refreshEvent || '*',
    () => {
      if (autoRefresh) {
        setIsRefreshing(true);
        // Trigger a re-render by updating state
        setTimeout(() => setIsRefreshing(false), 500);
      }
    },
    [autoRefresh, refreshEvent]
  );

  useEventBus(
    EventCategory.PROJECT,
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
        <Skeleton variant="rounded" height={height} />
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
          <RechartsBarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              dataKey={dataKey}
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              animationDuration={300}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
