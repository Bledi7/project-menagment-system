import { useReports } from '@/hooks/useReports';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { format } from 'date-fns';

export default function Reports() {
  const { data: reports, isLoading } = useReports();

  if (isLoading) return <Loading />;

  if (!reports || reports.length === 0) {
    return <EmptyState title="No reports found" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Reports
      </h1>
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} title={report.userName || 'Anonymous'}>
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
