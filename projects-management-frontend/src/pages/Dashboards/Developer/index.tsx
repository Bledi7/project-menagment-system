import { Card } from '@/components/ui/Card';
import { useMyReports } from '@/hooks/useReports';
import { Loading } from '@/components/ui/Loading';

export default function Developer() {
  const { data: reports, isLoading } = useMyReports();

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Developer Dashboard
      </h1>
      <Card title="My Reports">
        <p className="text-3xl font-bold text-primary-600">
          {reports?.length || 0}
        </p>
      </Card>
    </div>
  );
}
