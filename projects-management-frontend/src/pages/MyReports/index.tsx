import { useMyReports } from '@/hooks/useReports';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/utils/constants';

export default function MyReports() {
  const { data: reports, isLoading } = useMyReports();

  if (isLoading) return <Loading />;

  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        title="No reports found"
        description="Create your first report"
        action={
          <Link to={ROUTES.CREATE_REPORT}>
            <Button>Create Report</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Reports
        </h1>
        <Link to={ROUTES.CREATE_REPORT}>
          <Button>Create Report</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Date: {format(new Date(report.date), 'MMM dd, yyyy')}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{report.report}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
