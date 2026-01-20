import { useEffect } from 'react';
import { useSocket } from './useSocket';
import { useMessages } from '@/hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api';
import { SocketMessage } from '@/types';

export const useChatSocket = (conversationId: number | null) => {
  const { socket, on, off } = useSocket();
  const { data: messages } = useMessages(conversationId || 0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId || !socket) return;

    const handleMessage = (data: SocketMessage) => {
      if (conversationId) {
        queryClient.setQueryData<unknown[]>(
          queryKeys.messages(conversationId),
          (old = []) => [
            ...old,
            {
              senderId: data.senderId,
              text: data.text,
              createdAt: new Date(data.createdAt).toISOString(),
            },
          ]
        );
      }
    };

    on('getMessage', handleMessage);

    return () => {
      off('getMessage', handleMessage);
    };
  }, [conversationId, socket, on, off, queryClient]);

  return { socket };
};
