'use client';

import { useLanguage } from '@/components/language-provider';
import { adminApi, publicApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Sector } from '@/types/sector';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useOrganization() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const { token, isAuthenticated, user } = useAuthStore();
  const getSectorsQuery = useQuery({
    queryKey: ['get-sectors'],
    queryFn: async () => {
      return publicApi.getSectors(language);
    },
  });
  const createSectorMutation = useMutation({
    mutationKey: ['create-sector'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.createSector(formData, token);
    },
  });
  const updateSectorsMutation = useMutation({
    mutationKey: ['update-sector'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.updateSector(formData, token);
    },
  });

  const deleteSectorMutation = useMutation({
    mutationKey: ['delete-sector'],
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.deleteSector(id, token);
    },
  });

  const getDirectorsQuery = useQuery({
    queryKey: ['get-directors'],
    queryFn: async () => {
      return publicApi.getDirectors(language);
    },
  });
  const getDirectorsBySector = useQuery({
    queryKey: ['get-directors-by-sector', user?.sector_id, language],
    queryFn: async () => {
      if (!user || !user.sector_id) {
        return [];
      }
      return publicApi.getDirectorsBySectors(user.sector_id, language);
    },
    enabled: !!user && !!user.sector_id,
  });
  const createDirectorsQuery = useMutation({
    mutationKey: ['create-director'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.createDirector(formData, token);
    },
  });
  const deleteDirectorMutation = useMutation({
    mutationKey: ['delete-director'],
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Authentication required');
      return await adminApi.deleteDirector(id, token);
    },
  });

  const updateDirectorsQuery = useMutation({
    mutationKey: ['update-directors'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.updateDirector(formData, token);
    },
  });
  const getTeamLeadersQuery = useQuery({
    queryKey: ['get-team-leaders'],
    queryFn: async () => {
      return publicApi.getDepartments(language);
    },
  });
  const createTeamQuery = useMutation({
    mutationKey: ['create-team'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.createTeam(formData, token);
    },
  });
  const updateTeamQuery = useMutation({
    mutationKey: ['update-teams'],
    mutationFn: async (formData: FormData) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.updateTeam(formData, token);
    },
  });
  const deleteTeamQuery = useMutation({
    mutationKey: ['delete-teams'],
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Authentication required');
      return adminApi.deleteTeam(id, token);
    },
  });
  const getExpertiseQuery = useQuery({
    queryKey: ['get-expertise'],
    queryFn: async () => {
      return publicApi.getExpertise(language);
    },
  });

  const getSubcitiesQuery = useQuery({
    queryKey: ['get-subcities'],
    queryFn: async () => {
      return publicApi.getSubcities();
    },
  });
  return {
    Sectors: getSectorsQuery.data || [],
    getSectors: getSectorsQuery.refetch,
    createSector: createSectorMutation.mutateAsync || [],
    updateSectors: updateSectorsMutation.mutateAsync || [],
    deleteSector: deleteSectorMutation.mutateAsync,
    Directors: getDirectorsQuery.data || [],
    DirectorsBySector: getDirectorsBySector.data || [],
    getDirectors: getDirectorsQuery.refetch,
    createDirector: createDirectorsQuery.mutateAsync || [],
    updateDirector: updateDirectorsQuery.mutateAsync || [],
    deleteDirector: deleteDirectorMutation.mutateAsync,
    Teams: getTeamLeadersQuery.data || [],
    createTeam: createTeamQuery.mutateAsync || [],
    updateTeam: updateTeamQuery.mutateAsync || [],
    deleteTeam: deleteTeamQuery.mutateAsync || [],
    Expertise: getExpertiseQuery.data || [],
    Subcities: getSubcitiesQuery.data || [],
  };
}
