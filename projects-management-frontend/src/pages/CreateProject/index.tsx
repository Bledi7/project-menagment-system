import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '@/hooks/useProjects';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

const projectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  status: z.string().optional(),
  startDate: z.string().optional(),
  key: z.string().optional(),
  listId: z.string().optional(),
  boardId: z.string().optional(),
  isJiraProject: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProject() {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data: ProjectFormData) => {
    createProject.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.PROJECTS);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Create New Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Title"
            {...register('title')}
            error={errors.title?.message}
          />
          <Input
            label="Status"
            {...register('status')}
            error={errors.status?.message}
          />
          <Input
            label="Start Date"
            type="date"
            {...register('startDate')}
            error={errors.startDate?.message}
          />
          <Input
            label="Project Key"
            {...register('key')}
            error={errors.key?.message}
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              isLoading={createProject.isPending}
              className="flex-1"
            >
              Create Project
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.PROJECTS)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
