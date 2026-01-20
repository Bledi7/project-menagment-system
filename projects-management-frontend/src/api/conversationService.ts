import apiClient from '@/utils/api';
import {
  Conversation,
  CreateConversationDto,
  CreateGroupChatDto,
  AddUserToGroupDto,
  ApiResponse,
} from '@/types';

export const conversationService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations');
    return response.data.data;
  },

  getConversation: async (id: number): Promise<Conversation> => {
    const response = await apiClient.get<ApiResponse<Conversation>>(`/conversations/${id}`);
    return response.data.data;
  },

  createConversation: async (data: CreateConversationDto): Promise<Conversation> => {
    const response = await apiClient.post<ApiResponse<Conversation>>('/conversations', data);
    return response.data.data;
  },

  createGroupChat: async (data: CreateGroupChatDto): Promise<Conversation> => {
    const response = await apiClient.post<ApiResponse<Conversation>>('/conversations/group', data);
    return response.data.data;
  },

  addUserToGroup: async (data: AddUserToGroupDto): Promise<Conversation> => {
    const response = await apiClient.post<ApiResponse<Conversation>>('/conversations/add-user', data);
    return response.data.data;
  },
};
