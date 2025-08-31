'use client';

import { adminApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useQuery } from '@tanstack/react-query';

export function useNotifications() {
  const { token, isAuthenticated, user } = useAuthStore();

  const getNotifications = useQuery({
    queryKey: ['get-notification'],
    queryFn: async () => {
      return adminApi.notifications.getAll(token!);
    },
  });
  return {
    Notifications: getNotifications.data || [],
  };
}
