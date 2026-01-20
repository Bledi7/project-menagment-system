import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamService, queryKeys } from '@/api';
import { useTeamStore, useAuthStore } from '@/store';
import { CreateTeamDto, UpdateTeamDto } from '@/types';
import toast from 'react-hot-toast';

export const useTeams = () => {
  const { setTeams } = useTeamStore();
  const { isAuthenticated } = useAuthStore();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.teams,
    queryFn: teamService.getTeams,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
    onSuccess: (data) => {
      setTeams(data);
    },
  });
};

export const useTeam = (id: number) => {
  return useQuery({
    queryKey: queryKeys.team(id),
    queryFn: () => teamService.getTeam(id),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  const { addTeam } = useTeamStore();

  return useMutation({
    mutationFn: (data: CreateTeamDto) => teamService.createTeam(data),
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      addTeam(team);
      toast.success('Team created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create team');
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  const { updateTeam } = useTeamStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTeamDto }) =>
      teamService.updateTeam(id, data),
    onSuccess: (team, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      queryClient.invalidateQueries({ queryKey: queryKeys.team(variables.id) });
      updateTeam(variables.id, team);
      toast.success('Team updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update team');
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  const { deleteTeam } = useTeamStore();

  return useMutation({
    mutationFn: (id: number) => teamService.deleteTeam(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      deleteTeam(id);
      toast.success('Team deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete team');
    },
  });
};
