'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi, subcityApi } from '@/lib/api';
import { Employee, EmployeeFiltersTypes } from '@/types/employee';
import { useAuthStore } from '@/lib/auth-store';

export function useEmployees() {
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useAuthStore();
  // Get all employees
  const employeesQuery = useQuery({
    queryKey: ['get-employees'],
    queryFn: () => {
      if (!token) throw new Error('Authentication required');
      return employeesApi.getEmployees();
    },
  });

  // Create employee
  const createEmployeeMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return employeesApi.createEmployee(token, formData);
    },
  });

  // Update employee
  const updateEmployeeMutation = useMutation({
    mutationKey: ['update-employee'],
    mutationFn: async (data: any) => {
      if (!token) throw new Error('Authentication required');
      return await employeesApi.updateEmployee(token, data);
    },
  });

  // Delete employee
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: number) => {
      return employeesApi.deleteEmployee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    error: employeesQuery.error,
    refetch: employeesQuery.refetch,
    createEmployee: createEmployeeMutation.mutateAsync,
    updateEmployee: updateEmployeeMutation.mutateAsync,
    deleteEmployee: deleteEmployeeMutation.mutateAsync,
    isCreatingEmployee: createEmployeeMutation.isPending,
    isUpdatingEmployee: updateEmployeeMutation.isPending,
    isDeletingEmployee: deleteEmployeeMutation.isPending,
  };
}

// Hook for subcity-specific employees
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
