import { useAuthStore } from '@/store';
import { Card } from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Profile">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              First Name
            </label>
            <p className="text-gray-900 dark:text-white">{user.firstName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Name
            </label>
            <p className="text-gray-900 dark:text-white">{user.lastName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Email
            </label>
            <p className="text-gray-900 dark:text-white">{user.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Role
            </label>
            <p className="text-gray-900 dark:text-white">{user.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Status
            </label>
            <p className="text-gray-900 dark:text-white">{user.status}</p>
          </div>
          <Link to={ROUTES.UPDATE_PROFILE}>
            <Button>Update Profile</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
