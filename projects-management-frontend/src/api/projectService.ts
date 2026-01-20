import apiClient from '@/utils/api';
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ApiResponse,
} from '@/types';

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },

  getProject: async (id: number): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  getProjectByKey: async (key: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`/projects/key/${key}`);
    return response.data.data;
  },

  createProject: async (data: CreateProjectDto): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>('/projects', data);
    return response.data.data;
  },

  updateProject: async (id: number, data: UpdateProjectDto): Promise<Project> => {
    const response = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  getProjectStatistics: async (key: string): Promise<unknown> => {
    const response = await apiClient.get(`/statistics/${key}`);
    return response.data;
  },
};
