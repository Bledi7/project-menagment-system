/**
 * Line Chart Component
 * Real-time updates via Event Bus
 */

import { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
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

export interface LineChartData {
  name: string;
  [key: string]: string | number;
}

export interface LineChartProps {
  data: LineChartData[];
  lines: Array<{
    dataKey: string;
    name: string;
    color?: string;
    strokeWidth?: number;
  }>;
  xAxisKey?: string;
  title?: string;
  description?: string;
  height?: number;
  loading?: boolean;
  autoRefresh?: boolean;
  refreshEvent?: string;
  className?: string;
}

export const LineChart = ({
  data,
  lines,
  xAxisKey = 'name',
  title,
  description,
  height = 400,
  loading = false,
  autoRefresh = false,
  refreshEvent,
  className,
}: LineChartProps) => {
  const [chartData, setChartData] = useState<LineChartData[]>(data);
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
          <RechartsLineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color || `hsl(${index * 60}, 70%, 50%)`}
                strokeWidth={line.strokeWidth || 2}
                dot={{ r: 4 }}
                animationDuration={300}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
