import { useProjects } from '@/hooks/useProjects';
import { useDeleteProject } from '@/hooks/useProjects';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { format } from 'date-fns';

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading projects: {(error as Error).message}
      </div>
    );

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="Get started by creating your first project"
        action={
          <Link to={ROUTES.CREATE_PROJECT}>
            <Button>Create Project</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <Link to={ROUTES.CREATE_PROJECT}>
          <Button>Create Project</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} title={project.title}>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: {project.status || 'N/A'}
              </p>
              {project.startDate && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start Date:{' '}
                  {format(new Date(project.startDate), 'MMM dd, yyyy')}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`${ROUTES.PROJECT_DASHBOARD}/${project.key || project.id}/${project.isJiraProject || 'false'}`}
                  className="flex-1"
                >
                  <Button variant="secondary" size="sm" className="w-full">
                    View
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteProject.mutate(project.id)}
                  isLoading={deleteProject.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
