import { useUsers } from '@/hooks/useUsers';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function TeamMembers() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <Loading />;

  if (!users || users.length === 0) {
    return <EmptyState title="No team members found" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Team Members
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} title={`${user.firstName} ${user.lastName}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role: {user.role}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Status: {user.status}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
