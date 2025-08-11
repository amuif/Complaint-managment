'use client';

import { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/language-provider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserManagementTable } from '@/components/superadmin/user-management-table';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { PageLoader } from '@/components/ui/loader';

export default function UsersPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch admins from backend
  const {
    data: admins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admins'],
    queryFn: () => adminApi.getAdmins(token!),
    enabled: !!token,
  });

  if (isLoading) {
    return <PageLoader text="Loading users..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('userManagement')}</h1>
            <p className="text-muted-foreground">{t('userManagementDesc')}</p>
          </div>
        </div>
        <div className="text-center text-red-600 p-8">Failed to load users. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('userManagement')}</h1>
          <p className="text-muted-foreground">{t('userManagementDesc')}</p>
        </div>
        <Button className="w-full md:w-auto rounded-full">
          <Plus className="mr-2 h-4 w-4" /> {t('addUser')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchUsers')}
            className="pl-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder={t('role')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('role')}</SelectLabel>
                <SelectItem value="all">{t('allRoles')}</SelectItem>
                <SelectItem value="SuperAdmin">{t('superAdmin')}</SelectItem>
                <SelectItem value="SubCityAdmin">{t('subCityAdmin')}</SelectItem>
                <SelectItem value="Admin">{t('admin')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('status')}</SelectLabel>
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="active">{t('active')}</SelectItem>
                <SelectItem value="inactive">{t('inactive')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Management Table */}
      <UserManagementTable
        admins={admins || []}
        searchQuery={searchQuery}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
      />
    </div>
  );
}
