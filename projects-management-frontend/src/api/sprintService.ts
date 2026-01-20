import apiClient from '@/utils/api';
import { Sprint, CreateSprintDto, UpdateSprintDto, ApiResponse } from '@/types';

export const sprintService = {
  getSprints: async (): Promise<Sprint[]> => {
    const response = await apiClient.get<ApiResponse<Sprint[]>>('/sprints');
    return response.data.data;
  },

  getSprint: async (id: number): Promise<Sprint> => {
    const response = await apiClient.get<ApiResponse<Sprint>>(`/sprints/${id}`);
    return response.data.data;
  },

  getSprintsByProject: async (projectId: number): Promise<Sprint[]> => {
    const response = await apiClient.get<ApiResponse<Sprint[]>>(`/sprints/project/${projectId}`);
    return response.data.data;
  },

  createSprint: async (data: CreateSprintDto): Promise<Sprint> => {
    const response = await apiClient.post<ApiResponse<Sprint>>('/sprints', data);
    return response.data.data;
  },

  updateSprint: async (id: number, data: UpdateSprintDto): Promise<Sprint> => {
    const response = await apiClient.put<ApiResponse<Sprint>>(`/sprints/${id}`, data);
    return response.data.data;
  },

  deleteSprint: async (id: number): Promise<void> => {
    await apiClient.delete(`/sprints/${id}`);
  },
};
