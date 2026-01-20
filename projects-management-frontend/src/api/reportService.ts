import apiClient from '@/utils/api';
import { Report, CreateReportDto, UpdateReportDto, ApiResponse } from '@/types';

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<ApiResponse<Report[]>>('/reports');
    return response.data.data;
  },

  getReport: async (id: number): Promise<Report> => {
    const response = await apiClient.get<ApiResponse<Report>>(`/reports/${id}`);
    return response.data.data;
  },

  getMyReports: async (): Promise<Report[]> => {
    const response = await apiClient.get<ApiResponse<Report[]>>('/reports/my');
    return response.data.data;
  },

  getReportsByUser: async (userId: number): Promise<Report[]> => {
    const response = await apiClient.get<ApiResponse<Report[]>>(`/reports/user/${userId}`);
    return response.data.data;
  },

  createReport: async (data: CreateReportDto): Promise<Report> => {
    const response = await apiClient.post<ApiResponse<Report>>('/reports', data);
    return response.data.data;
  },

  updateReport: async (id: number, data: UpdateReportDto): Promise<Report> => {
    const response = await apiClient.put<ApiResponse<Report>>(`/reports/${id}`, data);
    return response.data.data;
  },

  deleteReport: async (id: number): Promise<void> => {
    await apiClient.delete(`/reports/${id}`);
  },
};
