import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useUpdateProfile } from '@/hooks/useUsers';
import { useAuthStore } from '@/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/utils/constants';

const profileSchema = z.object({
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  gender: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  gitHub: z.string().optional(),
  facebook: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UpdateProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      birthday: user?.birthday || '',
      gender: user?.gender || '',
      instagram: user?.instagram || '',
      twitter: user?.twitter || '',
      gitHub: user?.gitHub || '',
      facebook: user?.facebook || '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    if (!user) return;
    updateProfile.mutate(
      { id: user.id, data },
      {
        onSuccess: () => {
          navigate(ROUTES.PROFILE);
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Update Profile">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Phone Number"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <Input
            label="Address"
            {...register('address')}
            error={errors.address?.message}
          />
          <Input
            label="Birthday"
            type="date"
            {...register('birthday')}
            error={errors.birthday?.message}
          />
          <Input
            label="Gender"
            {...register('gender')}
            error={errors.gender?.message}
          />
          <Input
            label="Instagram"
            {...register('instagram')}
            error={errors.instagram?.message}
          />
          <Input
            label="Twitter"
            {...register('twitter')}
            error={errors.twitter?.message}
          />
          <Input
            label="GitHub"
            {...register('gitHub')}
            error={errors.gitHub?.message}
          />
          <Input
            label="Facebook"
            {...register('facebook')}
            error={errors.facebook?.message}
          />
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              isLoading={updateProfile.isPending}
              className="flex-1"
            >
              Update Profile
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.PROFILE)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
