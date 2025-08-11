'use client';

import { useQuery } from '@tanstack/react-query';
import { publicApi, adminApi } from '@/lib/api';
import { useLanguage } from '@/components/language-provider';
import { useAuthStore } from '@/lib/auth-store';

export function useServices() {
  const { lang } = useLanguage();
  const { token, isAuthenticated } = useAuthStore();

  // Get departments
  const departmentsQuery = useQuery({
    queryKey: ['departments', lang],
    queryFn: () => publicApi.getDepartments(lang),
  });

  // Get admin departments (if authenticated)
  const adminDepartmentsQuery = useQuery({
    queryKey: ['adminDepartments', lang, isAuthenticated],
    queryFn: () => {
      if (!token) throw new Error('Authentication required');
      return adminApi.getDepartments(token, lang);
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
  const { lang } = useLanguage();

  const officesQuery = useQuery({
    queryKey: ['offices', departmentId, lang],
    queryFn: () => {
      if (!departmentId) throw new Error('Department ID required');
      return publicApi.getOfficesByDepartment(departmentId, lang);
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
  const { lang } = useLanguage();

  const employeesQuery = useQuery({
    queryKey: ['departmentEmployees', departmentId, lang],
    queryFn: () => {
      if (!departmentId) throw new Error('Department ID required');
      return publicApi.getEmployeesByDepartment(departmentId, lang);
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
