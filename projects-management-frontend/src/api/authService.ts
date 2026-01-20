import apiClient from '@/utils/api';
import { LoginDto, RegisterDto, AuthResponse, RefreshTokenDto, User, ApiResponse } from '@/types';

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<{ message?: string; data: AuthResponse }>(
      '/auth/login',
      data
    );
    return response.data.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<{ message?: string; data: AuthResponse }>(
      '/auth/register',
      data
    );
    return response.data.data;
  },

  refreshToken: async (data: RefreshTokenDto): Promise<AuthResponse> => {
    const response = await apiClient.post<{ message?: string; data: AuthResponse }>(
      '/auth/refresh',
      data
    );
    return response.data.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<{ message?: string; data: User }>('/auth/me');
    return response.data.data;
  },

  logout: async (refreshToken?: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refreshToken });
  },
};
