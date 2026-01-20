import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService, queryKeys } from '@/api';
import { useAuthStore } from '@/store';
import { CreateReportDto, UpdateReportDto } from '@/types';
import toast from 'react-hot-toast';

export const useReports = () => {
  const { isAuthenticated } = useAuthStore();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: reportService.getReports,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
  });
};

export const useReport = (id: number) => {
  return useQuery({
    queryKey: queryKeys.report(id),
    queryFn: () => reportService.getReport(id),
    enabled: !!id,
  });
};

export const useMyReports = () => {
  const { isAuthenticated } = useAuthStore();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
  const shouldFetch = isAuthenticated && hasToken;

  return useQuery({
    queryKey: queryKeys.myReports,
    queryFn: reportService.getMyReports,
    enabled: shouldFetch, // Only fetch if authenticated AND has token
  });
};

export const useReportsByUser = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.reportsByUser(userId),
    queryFn: () => reportService.getReportsByUser(userId),
    enabled: !!userId,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReportDto) => reportService.createReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
      queryClient.invalidateQueries({ queryKey: queryKeys.myReports });
      toast.success('Report created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create report');
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReportDto }) =>
      reportService.updateReport(id, data),
    onSuccess: (report, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
      queryClient.invalidateQueries({ queryKey: queryKeys.report(variables.id) });
      if (report.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.reportsByUser(report.userId),
        });
      }
      toast.success('Report updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update report');
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports });
      queryClient.invalidateQueries({ queryKey: queryKeys.myReports });
      toast.success('Report deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete report');
    },
  });
};
