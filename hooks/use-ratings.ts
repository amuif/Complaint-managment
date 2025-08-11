'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useLanguage } from '@/components/language-provider';

export function useRatings() {
  const { language } = useLanguage();
  const { token, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Get ratings (admin only)
  const ratingsQuery = useQuery({
    queryKey: ['ratings', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getRatings(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  // Get public ratings (admin only)
  const publicRatingsQuery = useQuery({
    queryKey: ['publicRatings', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getPublicRatings(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  // Submit rating (public)
  const submitRatingMutation = useMutation({
    mutationFn: (data: {
      employee_id: number;
      service_id?: number;
      phone_number: string;
      courtesy: number;
      punctuality: number;
      knowledge: number;
      overall_experience?: string;
      suggestions?: string;
    }) => publicApi.submitRating(data, language),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['publicRatings'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });

  return {
    // Admin ratings
    ratings: ratingsQuery.data || [],
    isLoading: ratingsQuery.isLoading,
    isError: ratingsQuery.isError,
    error: ratingsQuery.error,

    // Public ratings (admin view)
    publicRatings: publicRatingsQuery.data || [],
    isLoadingPublicRatings: publicRatingsQuery.isLoading,

    // Submit rating (public)
    submitRating: submitRatingMutation.mutate,
    isSubmittingRating: submitRatingMutation.isPending,
    submitRatingError: submitRatingMutation.error,
  };
}

export function useDepartmentRatings(department?: string) {
  const { language } = useLanguage();

  const departmentRatingsQuery = useQuery({
    queryKey: ['departmentRatings', department, language],
    queryFn: () => {
      if (!department) throw new Error('Department required');
      return publicApi.getDepartmentRatings(department, language);
    },
    enabled: !!department,
  });

  return {
    departmentRatings: departmentRatingsQuery.data || [],
    isLoading: departmentRatingsQuery.isLoading,
    isError: departmentRatingsQuery.isError,
    error: departmentRatingsQuery.error,
  };
}
