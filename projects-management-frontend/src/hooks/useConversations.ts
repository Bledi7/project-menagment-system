import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService, queryKeys } from '@/api';
import {
  CreateConversationDto,
  CreateGroupChatDto,
  AddUserToGroupDto,
} from '@/types';
import toast from 'react-hot-toast';

export const useConversations = () => {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: conversationService.getConversations,
  });
};

export const useConversation = (id: number) => {
  return useQuery({
    queryKey: queryKeys.conversation(id),
    queryFn: () => conversationService.getConversation(id),
    enabled: !!id,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConversationDto) =>
      conversationService.createConversation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      toast.success('Conversation created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create conversation');
    },
  });
};

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupChatDto) =>
      conversationService.createGroupChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      toast.success('Group chat created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create group chat');
    },
  });
};

export const useAddUserToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddUserToGroupDto) =>
      conversationService.addUserToGroup(data),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      queryClient.invalidateQueries({
        queryKey: queryKeys.conversation(conversation.id),
      });
      toast.success('User added to group successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add user to group');
    },
  });
};
