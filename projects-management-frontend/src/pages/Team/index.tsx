import { useTeams } from '@/hooks/useTeams';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Team() {
  const { data: teams, isLoading } = useTeams();

  if (isLoading) return <Loading />;

  if (!teams || teams.length === 0) {
    return <EmptyState title="No teams found" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Teams
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} title={team.title}>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Members: {team.memberIds.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Leads: {team.leadIds.length}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
