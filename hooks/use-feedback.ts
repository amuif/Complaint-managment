'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useLanguage } from '@/components/language-provider';
import { toast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';

export function useFeedback() {
  const { language } = useLanguage();
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Get feedback (admin only)
  const feedbackQuery = useQuery({
    queryKey: ['feedback', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getFeedback(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  // Get public feedback (admin only)
  const publicFeedbackQuery = useQuery({
    queryKey: ['publicFeedback', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getPublicFeedback(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  // Submit feedback (public)
  const submitFeedbackMutation = useMutation({
    mutationFn: (data: {
      phone_number: string;
      section: string;
      department?: string;
      employee_id?: number;
      comment: string;
      rating?: number;
    }) => publicApi.submitFeedback(data, language),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['publicFeedback'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  // Check feedback status (public)
  const checkFeedbackStatusMutation = useMutation({
    mutationFn: (referenceNumber: string) =>
      publicApi.checkFeedbackStatus(referenceNumber, language),
  });

  // Respond to feedback (admin only)
  const respondToFeedbackMutation = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.respondToFeedback(id, token, response);
    },
    onSuccess: () => {
      toast({ title: 'Submitted' });
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });

  // Respond to public feedback (admin only)
  const respondToPublicFeedbackMutation = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.respondToPublicFeedback(id, token, response);
    },
    onSuccess: () => {
      toast({ title: 'Submitted' });
      queryClient.invalidateQueries({ queryKey: ['publicFeedback'] });
    },
  });

  return {
    // Admin feedback
    feedback: feedbackQuery.data || [],
    isLoading: feedbackQuery.isLoading,
    isError: feedbackQuery.isError,
    error: feedbackQuery.error,

    // Public feedback (admin view)
    publicFeedback: publicFeedbackQuery.data || null,
    isLoadingPublicFeedback: publicFeedbackQuery.isLoading,

    // Submit feedback (public)
    submitFeedback: submitFeedbackMutation.mutate,
    isSubmittingFeedback: submitFeedbackMutation.isPending,
    submitFeedbackError: submitFeedbackMutation.error,

    // Check feedback status
    checkFeedbackStatus: checkFeedbackStatusMutation.mutate,
    isCheckingFeedbackStatus: checkFeedbackStatusMutation.isPending,
    feedbackStatus: checkFeedbackStatusMutation.data,
    checkFeedbackStatusError: checkFeedbackStatusMutation.error,

    // Respond to feedback (admin)
    respondToFeedback: respondToFeedbackMutation.mutate,
    isRespondingToFeedback: respondToFeedbackMutation.isPending,
    respondToPublicFeedback: respondToPublicFeedbackMutation.mutate,
    isRespondingToPublicFeedback: respondToPublicFeedbackMutation.isPending,
  };
}
