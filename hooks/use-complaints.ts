'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useLanguage } from '@/components/language-provider';
import { toast } from 'sonner';

export function useComplaints(params?: { phone_number?: string; tracking_code?: string }) {
  const { language } = useLanguage();
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Get complaints (public or admin based on auth state)
  const complaintsQuery = useQuery({
    queryKey: ['complaints', params, language, isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated && token) {
        // Admin can see all complaints
        const data = await adminApi.getComplaints(token, language);
        return data;
      } else if (params?.tracking_code) {
        // Public user can track by tracking code
        return publicApi.trackComplaint(params.tracking_code, language);
      } else if (params?.phone_number) {
        // Public user can track by phone number
        return publicApi.trackComplaint(params.phone_number, language);
      }
      return [];
    },
    enabled: isAuthenticated || !!(params?.phone_number || params?.tracking_code),
  });

  // Get public complaints (admin only)
  const publicComplaintsQuery = useQuery({
    queryKey: ['publicComplaints', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      try {
        const result = await adminApi.getPublicComplaints(token, language);
        return Array.isArray(result.data)
          ? result.data.map((item) => ({ ...item, type: 'publicComplaint' }))
          : [];
      } catch (error) {
        console.error('Error fetching public complaints:', error);
        return [];
      }
    },
    enabled: isAuthenticated && !!token,
  });

  // Submit complaint (public)
  const submitComplaintMutation = useMutation({
    mutationFn: (formData: FormData) => publicApi.submitComplaint(formData, language),
    onSuccess: () => {
      if (params?.phone_number || params?.tracking_code) {
        queryClient.invalidateQueries({ queryKey: ['complaints', params] });
      }
    },
  });

  // Submit voice complaint (public)
  const submitVoiceComplaintMutation = useMutation({
    mutationFn: (formData: FormData) => publicApi.submitVoiceComplaint(formData, language),
    onSuccess: () => {
      if (params?.phone_number || params?.tracking_code) {
        queryClient.invalidateQueries({ queryKey: ['complaints', params] });
      }
    },
  });

  // Respond to complaint (admin only)
  const respondToComplaintMutation = useMutation({
    mutationFn: async ({
      id,
      response,
      status,
    }: {
      id: string;
      response: string;
      status: string;
    }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.respondToComplaint(id, token, response, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  // Respond to public complaint (admin only)
  const respondToPublicComplaintMutation = useMutation({
    mutationFn: async ({
      id,
      response,
      status,
    }: {
      id: string;
      response: string;
      status: string;
    }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.respondToPublicComplaint(id, token, response, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      toast.success('Your response have been submitted ');
    },
  });

  const editStatusToPublicComplaintMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      complaint_source,
    }: {
      id: string;
      status: string;
      complaint_source: string;
    }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.editPublicComplaintStatus(id, token, status, complaint_source);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
      toast.success('Your response have been submitted ');
    },
  });

  // Resolve complaint (admin only)
  const resolveComplaintMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.resolveComplaint(id, token, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  // Resolve public complaint (admin only)
  const resolvePublicComplaintMutation = useMutation({
    mutationFn: async ({ id, response }: { id: number; response?: string }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.resolvePublicComplaint(id, token, response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['publicComplaints'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  // Get complaint trends (admin only)
  const complaintTrendsQuery = useQuery({
    queryKey: ['complaintTrends'],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getComplaintTrends(token);
    },
    enabled: isAuthenticated && !!token,
  });

  return {
    // Regular complaints
    complaints: Array.isArray(complaintsQuery.data) ? complaintsQuery.data : [],
    isLoading: complaintsQuery.isLoading,
    isError: complaintsQuery.isError,
    error: complaintsQuery.error,

    // Public complaints (admin view)
    publicComplaints: Array.isArray(publicComplaintsQuery.data) ? publicComplaintsQuery.data : [],
    isLoadingPublicComplaints: publicComplaintsQuery.isLoading,
    isErrorPublicComplaints: publicComplaintsQuery.isError,
    publicComplaintsError: publicComplaintsQuery.error,

    // Submit complaint
    submitComplaint: submitComplaintMutation.mutate,
    isSubmittingComplaint: submitComplaintMutation.isPending,
    submitComplaintError: submitComplaintMutation.error,

    // Submit voice complaint
    submitVoiceComplaint: submitVoiceComplaintMutation.mutate,
    isSubmittingVoiceComplaint: submitVoiceComplaintMutation.isPending,
    submitVoiceComplaintError: submitVoiceComplaintMutation.error,

    // Respond to complaints
    respondToComplaint: respondToComplaintMutation.mutate,
    isRespondingToComplaint: respondToComplaintMutation.isPending,
    respondToPublicComplaint: respondToPublicComplaintMutation.mutate,
    isRespondingToPublicComplaint: respondToPublicComplaintMutation.isPending,
    editPublicComplaintStatus: editStatusToPublicComplaintMutation.mutate,

    // Resolve complaints
    resolveComplaint: resolveComplaintMutation.mutate,
    isResolvingComplaint: resolveComplaintMutation.isPending,
    resolvePublicComplaint: resolvePublicComplaintMutation.mutate,
    isResolvingPublicComplaint: resolvePublicComplaintMutation.isPending,

    // Trends
    complaintTrends: complaintTrendsQuery.data || [],
    isLoadingTrends: complaintTrendsQuery.isLoading,
  };
}
