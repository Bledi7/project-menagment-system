import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sprintService, queryKeys } from '@/api';
import { useSprintStore, useAuthStore } from '@/store';
import { CreateSprintDto, UpdateSprintDto } from '@/types';
import toast from 'react-hot-toast';

export const useSprints = () => {
  const { setSprints } = useSprintStore();
  const { isAuthenticated } = useAuthStore();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.sprints,
    queryFn: sprintService.getSprints,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
    onSuccess: (data) => {
      setSprints(data);
    },
  });
};

export const useSprint = (id: number) => {
  return useQuery({
    queryKey: queryKeys.sprint(id),
    queryFn: () => sprintService.getSprint(id),
    enabled: !!id,
  });
};

export const useSprintsByProject = (projectId: number) => {
  return useQuery({
    queryKey: queryKeys.sprintsByProject(projectId),
    queryFn: () => sprintService.getSprintsByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateSprint = () => {
  const queryClient = useQueryClient();
  const { addSprint } = useSprintStore();

  return useMutation({
    mutationFn: (data: CreateSprintDto) => sprintService.createSprint(data),
    onSuccess: (sprint) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints });
      if (sprint.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sprintsByProject(sprint.projectId),
        });
      }
      addSprint(sprint);
      toast.success('Sprint created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create sprint');
    },
  });
};

export const useUpdateSprint = () => {
  const queryClient = useQueryClient();
  const { updateSprint } = useSprintStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSprintDto }) =>
      sprintService.updateSprint(id, data),
    onSuccess: (sprint, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints });
      queryClient.invalidateQueries({ queryKey: queryKeys.sprint(variables.id) });
      if (sprint.projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.sprintsByProject(sprint.projectId),
        });
      }
      updateSprint(variables.id, sprint);
      toast.success('Sprint updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update sprint');
    },
  });
};

export const useDeleteSprint = () => {
  const queryClient = useQueryClient();
  const { deleteSprint } = useSprintStore();

  return useMutation({
    mutationFn: (id: number) => sprintService.deleteSprint(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sprints });
      deleteSprint(id);
      toast.success('Sprint deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete sprint');
    },
  });
};
