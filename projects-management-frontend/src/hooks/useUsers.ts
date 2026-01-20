import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, queryKeys } from '@/api';
import { useUserStore, useAuthStore } from '@/store';
import { CreateUserDto, UpdateUserDto, UpdateUserProfileDto } from '@/types';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const { isAuthenticated } = useAuthStore();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: userService.getUsers,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { addUser } = useUserStore();

  return useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      addUser(user);
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    onSuccess: (user, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) });
      updateUser(variables.id, user);
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserProfileDto }) =>
      userService.updateProfile(id, data),
    onSuccess: (updatedUser) => {
      if (user && user.id === updatedUser.id) {
        setUser(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(updatedUser.id) });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { deleteUser } = useUserStore();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      deleteUser(id);
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation({
    mutationFn: (id: number) => userService.approveUser(id),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(user.id) });
      updateUser(user.id, user);
      toast.success('User approved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to approve user');
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useUserStore();

  return useMutation({
    mutationFn: (id: number) => userService.rejectUser(id),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(user.id) });
      updateUser(user.id, user);
      toast.success('User rejected');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject user');
    },
  });
};
