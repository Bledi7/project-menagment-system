import { useParams } from 'react-router-dom';
import { useProjectByKey } from '@/hooks/useProjects';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';

export default function ProjectDashboard() {
  const { projectKey } = useParams<{ projectKey: string }>();
  const { data: project, isLoading } = useProjectByKey(projectKey || '');

  if (isLoading) return <Loading />;

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {project.title}
      </h1>
      <Card>
        <p className="text-gray-600 dark:text-gray-400">
          Status: {project.status || 'N/A'}
        </p>
      </Card>
    </div>
  );
}
