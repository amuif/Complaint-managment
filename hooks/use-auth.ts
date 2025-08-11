'use client';

import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

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

  const createAdminMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.createAdmin(formData, token);
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
    createAdmin: createAdminMutation.mutate,
    isCreatingAdmin: createAdminMutation.isPending,
    createAdminError: createAdminMutation.error,

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
