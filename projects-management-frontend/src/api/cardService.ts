import apiClient from '@/utils/api';
import { Card, CreateCardDto, UpdateCardDto, ApiResponse } from '@/types';

export const cardService = {
  getCards: async (): Promise<Card[]> => {
    const response = await apiClient.get<ApiResponse<Card[]>>('/cards');
    return response.data.data;
  },

  getCard: async (id: number): Promise<Card> => {
    const response = await apiClient.get<ApiResponse<Card>>(`/cards/${id}`);
    return response.data.data;
  },

  getCardsBySprint: async (sprintId: number): Promise<Card[]> => {
    const response = await apiClient.get<ApiResponse<Card[]>>(`/cards/sprint/${sprintId}`);
    return response.data.data;
  },

  createCard: async (data: CreateCardDto): Promise<Card> => {
    const response = await apiClient.post<ApiResponse<Card>>('/cards', data);
    return response.data.data;
  },

  updateCard: async (id: number, data: UpdateCardDto): Promise<Card> => {
    const response = await apiClient.put<ApiResponse<Card>>(`/cards/${id}`, data);
    return response.data.data;
  },

  deleteCard: async (id: number): Promise<void> => {
    await apiClient.delete(`/cards/${id}`);
  },
};
