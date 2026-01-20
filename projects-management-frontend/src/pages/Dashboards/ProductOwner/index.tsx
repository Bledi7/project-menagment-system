import { Card } from '@/components/ui/Card';
import { useProjects } from '@/hooks/useProjects';
import { Loading } from '@/components/ui/Loading';

export default function ProductOwner() {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Product Owner Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Projects">
          <p className="text-3xl font-bold text-primary-600">
            {projects?.length || 0}
          </p>
        </Card>
        <Card title="Active Projects">
          <p className="text-3xl font-bold text-green-600">
            {projects?.filter((p) => p.status === 'active').length || 0}
          </p>
        </Card>
        <Card title="Pending Projects">
          <p className="text-3xl font-bold text-yellow-600">
            {projects?.filter((p) => p.status === 'pending').length || 0}
          </p>
        </Card>
      </div>
    </div>
  );
}
