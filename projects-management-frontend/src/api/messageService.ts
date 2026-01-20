import apiClient from '@/utils/api';
import { Message, CreateMessageDto, ApiResponse } from '@/types';

export const messageService = {
  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await apiClient.get<ApiResponse<Message[]>>(
      `/conversations/${conversationId}/messages`
    );
    return response.data.data;
  },

  createMessage: async (data: CreateMessageDto): Promise<Message> => {
    const response = await apiClient.post<ApiResponse<Message>>('/messages', data);
    return response.data.data;
  },
};
