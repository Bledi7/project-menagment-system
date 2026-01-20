/**
 * Modern Dashboard Component
 * Example role-based dashboard using all new components
 */

import { useProjects } from '@/hooks/useProjects';
import { useCards } from '@/hooks/useCards';
import { useSprints } from '@/hooks/useSprints';
import { Card } from '@/components/ui/Card';
import { BarChart, PieChart, LineChart } from '@/components/charts';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { AdvancedFilters } from '@/components/ui/AdvancedFilters';
import { InlineTaskEditor } from '@/components/ui/InlineTaskEditor';
import { PresenceList } from '@/components/ui/PresenceIndicator';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { cn } from '@/utils/cn';

export interface ModernDashboardProps {
  role?: 'Admin' | 'Product Owner' | 'Scrum Master' | 'Developer';
  className?: string;
}

export const ModernDashboard = ({
  role = 'Product Owner',
  className,
}: ModernDashboardProps) => {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: cards, isLoading: cardsLoading } = useCards();
  const { data: sprints, isLoading: sprintsLoading } = useSprints();
  const { getFilteredTasks } = useTaskStore();
  const { selectedProject } = useProjectStore();

  const filteredTasks = getFilteredTasks();

  // Calculate statistics
  const taskStats = {
    total: cards?.length || 0,
    todo: cards?.filter((c) => c.status === 'todo').length || 0,
    inProgress: cards?.filter((c) => c.status === 'in_progress').length || 0,
    done: cards?.filter((c) => c.status === 'done').length || 0,
  };

  // Prepare chart data
  const statusChartData = [
    { name: 'To Do', value: taskStats.todo },
    { name: 'In Progress', value: taskStats.inProgress },
    { name: 'Done', value: taskStats.done },
  ];

  const velocityData = Array.isArray(sprints) ? sprints.slice(0, 5).map((_sprint: unknown, index: number) => ({
    name: `Sprint ${index + 1}`,
    completed: Math.floor(Math.random() * 20) + 10,
    planned: Math.floor(Math.random() * 20) + 15,
  })) : [];

  const projectProgressData = Array.isArray(projects) ? projects.slice(0, 5).map((project) => ({
    name: project.title.substring(0, 10),
    progress: Math.floor(Math.random() * 100),
  })) : [];

  const mockUsers = [
    { id: 1, name: 'John Doe', avatar: undefined },
    { id: 2, name: 'Jane Smith', avatar: undefined },
    { id: 3, name: 'Bob Johnson', avatar: undefined },
  ];

  if (projectsLoading || cardsLoading || sprintsLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={120} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="rounded" height={400} />
          <Skeleton variant="rounded" height={400} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {role} Dashboard
          </h1>
          {selectedProject && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {selectedProject.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <PresenceList users={mockUsers} maxVisible={5} />
          <AdvancedFilters />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {taskStats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">To Do</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {taskStats.todo}
              </p>
            </div>
            <Tag variant="default" size="lg">
              {taskStats.todo}
            </Tag>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {taskStats.inProgress}
              </p>
            </div>
            <Tag variant="primary" size="lg">
              {taskStats.inProgress}
            </Tag>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {taskStats.done}
              </p>
            </div>
            <Tag variant="success" size="lg">
              {taskStats.done}
            </Tag>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChart
          data={statusChartData}
          title="Task Status Distribution"
          description="Current distribution of tasks by status"
          autoRefresh
          refreshEvent="status_changed"
        />

        <BarChart
          data={projectProgressData}
          dataKey="progress"
          xAxisKey="name"
          title="Project Progress"
          description="Progress across active projects"
          autoRefresh
        />
      </div>

      {/* Velocity Chart */}
      {velocityData.length > 0 && (
        <LineChart
          data={velocityData}
          lines={[
            { dataKey: 'completed', name: 'Completed', color: '#10b981' },
            { dataKey: 'planned', name: 'Planned', color: '#0ea5e9' },
          ]}
          title="Sprint Velocity"
          description="Completed vs planned tasks over recent sprints"
          autoRefresh
        />
      )}

      {/* Tasks and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Tasks
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {filteredTasks.slice(0, 5).map((task) => (
              <InlineTaskEditor key={task.id} task={task} />
            ))}
            {filteredTasks.length === 0 && (
              <Card>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No tasks found
                </p>
              </Card>
            )}
          </div>
        </div>

        <div>
          <ActivityFeed limit={10} showFilters />
        </div>
      </div>
    </div>
  );
};
