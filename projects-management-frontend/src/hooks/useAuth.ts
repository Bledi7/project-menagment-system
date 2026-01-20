import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, queryKeys, userService } from '@/api';
import { useAuthStore } from '@/store';
import { LoginDto, RegisterDto, User } from '@/types';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ROUTES, ROLES } from '@/utils/constants';
import { eventBus, EventCategory } from '@/eventBus';

// Helper function to get dashboard route based on user role
const getDashboardRoute = (role: string): string => {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.ADMIN;
    case ROLES.PRODUCT_OWNER:
      return ROUTES.PRODUCT_OWNER;
    case ROLES.SCRUM_MASTER:
      return ROUTES.SCRUM_MASTER;
    case ROLES.DEVELOPER:
      return ROUTES.DEVELOPER;
    default:
      return ROUTES.HOME;
  }
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: async (response) => {
      // Set tokens first
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Fetch full user profile
      let userToSet: User;
      try {
        const fullUser = await userService.getUserById(response.user.id);
        userToSet = fullUser;
        setAuth(fullUser, response.accessToken, response.refreshToken);
        queryClient.setQueryData(queryKeys.currentUser, fullUser);
        queryClient.setQueryData(queryKeys.user(fullUser.id), fullUser);
      } catch (error) {
        // If fetching full user fails, use the minimal user from auth response
        const minimalUser: User = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          role: response.user.role as any,
          status: response.user.status as any,
          phoneNumber: null,
          address: null,
          birthday: null,
          gender: null,
          instagram: null,
          twitter: null,
          gitHub: null,
          facebook: null,
          profileImagePath: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        userToSet = minimalUser;
        setAuth(minimalUser, response.accessToken, response.refreshToken);
        queryClient.setQueryData(queryKeys.currentUser, minimalUser);
      }
      
      toast.success('Login successful!');
      
      // Redirect to role-based dashboard
      // Small delay to ensure Zustand persist has written to localStorage
      const dashboardRoute = getDashboardRoute(userToSet.role);
      setTimeout(() => {
        navigate(dashboardRoute, { replace: true });
      }, 150);
    },
    onError: (error: any) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        error?.message || 
        'Login failed';
      toast.error(errorMessage);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: async (response) => {
      // Set tokens first
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Fetch full user profile
      let userToSet: User;
      try {
        const fullUser = await userService.getUserById(response.user.id);
        userToSet = fullUser;
        setAuth(fullUser, response.accessToken, response.refreshToken);
        queryClient.setQueryData(queryKeys.currentUser, fullUser);
        queryClient.setQueryData(queryKeys.user(fullUser.id), fullUser);
      } catch (error) {
        // If fetching full user fails, use the minimal user from auth response
        const minimalUser: User = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          role: response.user.role as any,
          status: response.user.status as any,
          phoneNumber: null,
          address: null,
          birthday: null,
          gender: null,
          instagram: null,
          twitter: null,
          gitHub: null,
          facebook: null,
          profileImagePath: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        userToSet = minimalUser;
        setAuth(minimalUser, response.accessToken, response.refreshToken);
        queryClient.setQueryData(queryKeys.currentUser, minimalUser);
      }
      
      toast.success('Registration successful!');
      
      // Redirect to role-based dashboard
      // Small delay to ensure Zustand persist has written to localStorage
      const dashboardRoute = getDashboardRoute(userToSet.role);
      setTimeout(() => {
        navigate(dashboardRoute, { replace: true });
      }, 150);
    },
    onError: (error: any) => {
      const errorMessage = 
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        error?.message || 
        'Registration failed';
      toast.error(errorMessage);
    },
  });
};

export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated && !user,
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      // Get refresh token from store or localStorage
      const token = refreshToken || localStorage.getItem('refreshToken') || undefined;
      return authService.logout(token);
    },
    onSuccess: () => {
      // Emit logout event to disconnect socket
      eventBus.emit(EventCategory.SOCKET, 'disconnect', {});
      
      // Clear auth state
      logout();
      
      // Clear all query cache
      queryClient.clear();
      
      // Clear localStorage (tokens are already cleared by logout, but ensure everything is cleared)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login
      navigate(ROUTES.LOGIN, { replace: true });
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      // Emit logout event to disconnect socket even on error
      eventBus.emit(EventCategory.SOCKET, 'disconnect', {});
      
      // Even if API call fails, logout locally
      logout();
      queryClient.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate(ROUTES.LOGIN, { replace: true });
      
      // Only show error if it's not a network error (might be offline)
      if (error?.response) {
        toast.error('Logout failed, but you have been logged out locally');
      } else {
        toast.success('Logged out successfully');
      }
    },
  });
};
