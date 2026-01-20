import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateReport } from '@/hooks/useReports';
import { useAuthStore } from '@/store';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

const reportSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  report: z.string().min(1, 'Report content is required'),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function CreateReport() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const createReport = useCreateReport();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = (data: ReportFormData) => {
    createReport.mutate(
      {
        ...data,
        userId: user?.id,
        userName: `${user?.firstName} ${user?.lastName}`,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.MY_REPORTS);
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Create New Report">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Date"
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
          <Textarea
            label="Report"
            rows={10}
            {...register('report')}
            error={errors.report?.message}
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              isLoading={createReport.isPending}
              className="flex-1"
            >
              Create Report
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.MY_REPORTS)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
