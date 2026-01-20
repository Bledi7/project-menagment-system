import apiClient from '@/utils/api';
import { Team, CreateTeamDto, UpdateTeamDto, ApiResponse } from '@/types';

export const teamService = {
  getTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get<ApiResponse<Team[]>>('/teams');
    return response.data.data;
  },

  getTeam: async (id: number): Promise<Team> => {
    const response = await apiClient.get<ApiResponse<Team>>(`/teams/${id}`);
    return response.data.data;
  },

  createTeam: async (data: CreateTeamDto): Promise<Team> => {
    const response = await apiClient.post<ApiResponse<Team>>('/teams', data);
    return response.data.data;
  },

  updateTeam: async (id: number, data: UpdateTeamDto): Promise<Team> => {
    const response = await apiClient.put<ApiResponse<Team>>(`/teams/${id}`, data);
    return response.data.data;
  },

  deleteTeam: async (id: number): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },
};
