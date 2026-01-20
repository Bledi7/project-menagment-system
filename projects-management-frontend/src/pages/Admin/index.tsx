import { useUsers } from '@/hooks/useUsers';
import { useApproveUser, useRejectUser, useDeleteUser } from '@/hooks/useUsers';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Admin() {
  const { data: users, isLoading, error } = useUsers();
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();
  const deleteUser = useDeleteUser();

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading users: {(error as Error).message}
      </div>
    );

  const pendingUsers = users?.filter((u) => u.status === 'pending') || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Dashboard
      </h1>
      <Card title="Pending User Approvals">
        {pendingUsers.length === 0 ? (
          <EmptyState title="No pending users" />
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email} • {user.role}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveUser.mutate(user.id)}
                    isLoading={approveUser.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => rejectUser.mutate(user.id)}
                    isLoading={rejectUser.isPending}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteUser.mutate(user.id)}
                    isLoading={deleteUser.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
