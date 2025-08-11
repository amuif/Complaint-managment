'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useLanguage } from '@/components/language-provider';

export function useStatistics() {
  const { language } = useLanguage();
  const { token, isAuthenticated } = useAuthStore();

  // Get public statistics
  const publicStatisticsQuery = useQuery({
    queryKey: ['publicStatistics', language],
    queryFn: () => publicApi.getStatistics(language),
    enabled: !isAuthenticated,
  });

  // Get admin statistics
  const adminStatisticsQuery = useQuery({
    queryKey: ['adminStatistics', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getStatistics(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  // Get location-based statistics (admin only)
  const locationStatisticsQuery = useQuery({
    queryKey: ['locationStatistics', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getStatisticsWithLocation(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  // Get location hierarchy (admin only)
  const locationHierarchyQuery = useQuery({
    queryKey: ['locationHierarchy', language, isAuthenticated],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getLocationHierarchy(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  const statistics = isAuthenticated ? adminStatisticsQuery.data : publicStatisticsQuery.data;

  const isLoading = isAuthenticated
    ? adminStatisticsQuery.isLoading
    : publicStatisticsQuery.isLoading;

  const isError = isAuthenticated ? adminStatisticsQuery.isError : publicStatisticsQuery.isError;

  const error = isAuthenticated ? adminStatisticsQuery.error : publicStatisticsQuery.error;

  return {
    statistics,
    isLoading,
    isError,
    error,

    // Location-based statistics (admin only)
    locationStatistics: locationStatisticsQuery.data,
    isLoadingLocationStatistics: locationStatisticsQuery.isLoading,

    // Location hierarchy (admin only)
    locationHierarchy: locationHierarchyQuery.data,
    isLoadingLocationHierarchy: locationHierarchyQuery.isLoading,
  };
}
