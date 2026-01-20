import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardService, queryKeys } from '@/api';
import { useAuthStore } from '@/store';
import { CreateCardDto, UpdateCardDto } from '@/types';
import toast from 'react-hot-toast';

export const useCards = () => {
  const { isAuthenticated } = useAuthStore();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.cards,
    queryFn: cardService.getCards,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
  });
};

export const useCard = (id: number) => {
  return useQuery({
    queryKey: queryKeys.card(id),
    queryFn: () => cardService.getCard(id),
    enabled: !!id,
  });
};

export const useCardsBySprint = (sprintId: number) => {
  return useQuery({
    queryKey: queryKeys.cardsBySprint(sprintId),
    queryFn: () => cardService.getCardsBySprint(sprintId),
    enabled: !!sprintId,
  });
};

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardDto) => cardService.createCard(data),
    onSuccess: (card) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cardsBySprint(card.sprintId),
      });
      toast.success('Card created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create card');
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCardDto }) =>
      cardService.updateCard(id, data),
    onSuccess: (card, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards });
      queryClient.invalidateQueries({ queryKey: queryKeys.card(variables.id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cardsBySprint(card.sprintId),
      });
      toast.success('Card updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update card');
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cardService.deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cards });
      toast.success('Card deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete card');
    },
  });
};
