import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, queryKeys } from '@/api';
import { CreateMessageDto } from '@/types';
import toast from 'react-hot-toast';

export const useMessages = (conversationId: number) => {
  return useQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: () => messageService.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageDto) => messageService.createMessage(data),
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.messages(message.conversationId),
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};
