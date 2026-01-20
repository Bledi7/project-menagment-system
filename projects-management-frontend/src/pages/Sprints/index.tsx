import { useSprints } from '@/hooks/useSprints';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';

export default function Sprints() {
  const { data: sprints, isLoading } = useSprints();

  if (isLoading) return <Loading />;

  if (!sprints || sprints.length === 0) {
    return <EmptyState title="No sprints found" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Sprints
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprints.map((sprint) => (
          <Card key={sprint.id} title={sprint.title}>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Created: {format(new Date(sprint.createdAt), 'MMM dd, yyyy')}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
