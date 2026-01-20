import apiClient from '@/utils/api';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserProfileDto,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data.data;
  },

  updateUser: async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  updateProfile: async (id: number, data: UpdateUserProfileDto): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}/profile`, data);
    return response.data.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  approveUser: async (id: number): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}/approve`);
    return response.data.data;
  },

  rejectUser: async (id: number): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}/reject`);
    return response.data.data;
  },
};
