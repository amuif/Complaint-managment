'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { subcityApi } from '@/lib/api';
import { Subcities } from '@/types/subcities';

export function useSubcityEmployees(subcity: string) {
  const employeesQuery = useQuery({
    queryKey: ['subcity-employees', subcity],
    queryFn: () => subcityApi.getEmployeesBySubcity(subcity),
    enabled: !!subcity,
  });

  return {
    employees: employeesQuery.data?.employees || [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    error: employeesQuery.error,
    refetch: employeesQuery.refetch,
  };
}

export function useSubcity() {
  const createSubcityMutation = useMutation({
    mutationFn: async (payload: Partial<Subcities>) => {
      return subcityApi.crateSubcity(payload);
    },
  });
  const updateSubcityMutation = useMutation({
    mutationFn: async (payload: Partial<Subcities>) => {
      return subcityApi.updateSubcity(payload);
    },
  });
  const deleteSubcityMutation = useMutation({
    mutationKey: ['delete subcity'],
    mutationFn: async (id: string) => {
      return subcityApi.deleteSubcity(id);
    },
  });
  return {
    createSubcity: createSubcityMutation.mutateAsync,
    updateSubcity: updateSubcityMutation.mutateAsync,
    deleteSubcity: deleteSubcityMutation.mutateAsync,
  };
}
// Hook for subcity-specific complaints
export function useSubcityComplaints(subcity: string) {
  const complaintsQuery = useQuery({
    queryKey: ['subcity-complaints', subcity],
    queryFn: () => subcityApi.getComplaintsBySubcity(subcity),
    enabled: !!subcity,
  });

  return {
    complaints: complaintsQuery.data?.complaints || [],
    publicComplaints: complaintsQuery.data?.publicComplaints || [],
    isLoading: complaintsQuery.isLoading,
    isError: complaintsQuery.isError,
    error: complaintsQuery.error,
    refetch: complaintsQuery.refetch,
  };
}

// Hook for subcity-specific feedback
export function useSubcityFeedback(subcity: string) {
  const feedbackQuery = useQuery({
    queryKey: ['subcity-feedback', subcity],
    queryFn: () => subcityApi.getFeedbackBySubcity(subcity),
    enabled: !!subcity,
  });

  return {
    feedback: feedbackQuery.data?.feedback || [],
    publicFeedback: feedbackQuery.data?.publicFeedback || [],
    isLoading: feedbackQuery.isLoading,
    isError: feedbackQuery.isError,
    error: feedbackQuery.error,
    refetch: feedbackQuery.refetch,
  };
}

// Hook for subcity-specific ratings
export function useSubcityRatings(subcity: string) {
  const ratingsQuery = useQuery({
    queryKey: ['subcity-ratings', subcity],
    queryFn: () => subcityApi.getRatingsBySubcity(subcity),
    enabled: !!subcity,
  });

  return {
    ratings: ratingsQuery.data?.ratings || [],
    publicRatings: ratingsQuery.data?.publicRatings || [],
    isLoading: ratingsQuery.isLoading,
    isError: ratingsQuery.isError,
    error: ratingsQuery.error,
    refetch: ratingsQuery.refetch,
  };
}
