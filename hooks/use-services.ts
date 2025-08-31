'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { useLanguage} from '@/components/language-provider';
import { useAuthStore } from '@/lib/auth-store';

export function useServices() {
  const { language} = useLanguage();
  const { token, isAuthenticated } = useAuthStore();

  // Get departments
  const departmentsQuery = useQuery({
    queryKey: ['departments', language],
    queryFn: () => publicApi.getDepartments(language),
  });

  // Get admin departments (if authenticated)
  const adminDepartmentsQuery = useQuery({
    queryKey: ['adminDepartments', language, isAuthenticated],
    queryFn: () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getDepartments(token, language);
    },
    enabled: isAuthenticated && !!token,
  });

  return {
    departments: isAuthenticated ? adminDepartmentsQuery.data || [] : departmentsQuery.data || [],
    isLoading: isAuthenticated ? adminDepartmentsQuery.isLoading : departmentsQuery.isLoading,
    isError: isAuthenticated ? adminDepartmentsQuery.isError : departmentsQuery.isError,
    error: isAuthenticated ? adminDepartmentsQuery.error : departmentsQuery.error,
  };
}

export function useOffices(departmentId?: number) {
  const { language } = useLanguage();

  const officesQuery = useQuery({
    queryKey: ['offices', departmentId, language],
    queryFn: () => {
      if (!departmentId) throw new Error('Department ID required');
      return publicApi.getOfficesByDepartment(departmentId, language);
    },
    enabled: !!departmentId,
  });

  return {
    offices: officesQuery.data || [],
    isLoading: officesQuery.isLoading,
    isError: officesQuery.isError,
    error: officesQuery.error,
  };
}

export function useDepartmentEmployees(departmentId?: number) {
  const { language } = useLanguage();

  const employeesQuery = useQuery({
    queryKey: ['departmentEmployees', departmentId, language],
    queryFn: () => {
      if (!departmentId) throw new Error('Department ID required');
      return publicApi.getEmployeesByDepartment(departmentId, language);
    },
    enabled: !!departmentId,
  });

  return {
    employees: employeesQuery.data || [],
    isLoading: employeesQuery.isLoading,
    isError: employeesQuery.isError,
    error: employeesQuery.error,
  };
}
