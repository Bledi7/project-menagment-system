import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, queryKeys } from '@/api';
import { useProjectStore } from '@/store';
import { useAuthStore } from '@/store';
import { CreateProjectDto, UpdateProjectDto } from '@/types';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const { setProjects } = useProjectStore();
  const { isAuthenticated } = useAuthStore();
  
  // Check token reactively using a state or effect
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  
  // Only enable if BOTH authenticated state AND token exist
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: projectService.getProjects,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
    onSuccess: (data) => {
      setProjects(data);
    },
  });
};

export const useProject = (id: number) => {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
  });
};

export const useProjectByKey = (key: string) => {
  return useQuery({
    queryKey: queryKeys.projectByKey(key),
    queryFn: () => projectService.getProjectByKey(key),
    enabled: !!key,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { addProject } = useProjectStore();

  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectService.createProject(data),
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      addProject(project);
      toast.success('Project created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create project');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const { updateProject } = useProjectStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectDto }) =>
      projectService.updateProject(id, data),
    onSuccess: (project, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(variables.id) });
      updateProject(variables.id, project);
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update project');
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { deleteProject } = useProjectStore();

  return useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      deleteProject(id);
      toast.success('Project deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });
};
