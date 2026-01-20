import { Card } from '@/components/ui/Card';
import { useTeams } from '@/hooks/useTeams';
import { Loading } from '@/components/ui/Loading';

export default function ScrumMaster() {
  const { data: teams, isLoading } = useTeams();

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Scrum Master Dashboard
      </h1>
      <Card title="Total Teams">
        <p className="text-3xl font-bold text-primary-600">
          {teams?.length || 0}
        </p>
      </Card>
    </div>
  );
}
