'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';

export function useAuth() {
  const { login, logout, token, user, isAuthenticated, setLoading, setError, error } =
    useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      setLoading(true);
      try {
        return await adminApi.login(credentials);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      login(data.token, data.admin);
      setLoading(false);
      // Redirect based on role
      if (data.admin.role === 'SuperAdmin') {
        router.push('/superadmin');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: Error) => {
      setLoading(false);
      setError(error.message);
    },
  });

  const getAdminMutation = useQuery({
    queryKey: ['get-admins'],
    queryFn: async () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getAdmins(token);
    },
  });

  const createAdminMutation = useMutation({
    mutationKey: ['create-admins'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.createAdmin(formData, token);
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: async (formdata: FormData) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.updateAdmin(formdata, token);
    },
  });
  const deleteAdminMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.deleteAdmin(id, token);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.updateProfile(formData, token);
    },
    onSuccess: (data) => {
      // Update user data in store
      login(token!, data.admin);
    },
  });

  const requestPasswordResetMutation = useMutation({
    mutationFn: async (username: string) => {
      return adminApi.requestPasswordReset(username);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; new_password: string }) => {
      return adminApi.resetPassword(data);
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    // Authentication
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: error,
    clearError: useAuthStore.getState().clearError,
    logout: handleLogout,

    // Profile management
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // Admin management (SuperAdmin only)
    getAdmins: getAdminMutation.data || [],
    createAdmin: createAdminMutation.mutateAsync,
    updateAdmin: updateAdminMutation.mutateAsync,
    isCreatingAdmin: createAdminMutation.isPending,
    createAdminError: createAdminMutation.error,
    deleteAdmin: deleteAdminMutation.mutateAsync || '',

    // Password reset
    requestPasswordReset: requestPasswordResetMutation.mutate,
    isRequestingPasswordReset: requestPasswordResetMutation.isPending,
    requestPasswordResetError: requestPasswordResetMutation.error,

    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    resetPasswordError: resetPasswordMutation.error,

    // User state
    user,
    token,
    isAuthenticated,
  };
}
