'use client';

import { useEffect, useState } from 'react';
import { Search, Plus, Download, Filter } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/language-provider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmployeeManagementTable } from '@/components/superadmin/employee-management-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeAnalytics } from '@/components/superadmin/employee-analytics';
import { AddEmployeeDialog } from '@/components/superadmin/add-employee-dialog';
import { ExportDialog } from '@/components/superadmin/export-dialog';
import { useOrganization } from '@/hooks/use-organization';

export default function AllAdminEmployeesPage() {
  const { t } = useLanguage();
  const { DirectorsBySector, Subcities } = useOrganization();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [viewType, setViewType] = useState('list');
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('allEmployees')}</h1>
          <p className="text-muted-foreground">{t('allEmployeesDesc')}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <AddEmployeeDialog />
          <ExportDialog
            dataType="employees"
            filters={{
              regionFilter,
              departmentFilter,
              searchQuery,
            }}
            triggerText={t('exportEmployees')}
          />
        </div>
      </div>

      {/* Filters and Tabs */}
      <Tabs defaultValue={viewType} onValueChange={setViewType} className="w-full"> <div className="flex flex-col gap-4 md:flex-row md:items-center"> <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchEmployees')}
              className="pl-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder={t('region')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Regions</SelectItem>
                  {Subcities.map((subcity) => (
                    <SelectItem key={subcity.id} value={subcity.id}>
                      {subcity.name_en}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder={t('department')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Directors</SelectItem>
                  {DirectorsBySector.map((director) => (
                    <SelectItem key={director.id} value={director.id}>
                      {director.name_en}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="list">{t('list')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Employee List/Analytics View */}
        <TabsContent value="list" className="mt-6">
          <EmployeeManagementTable
            searchQuery={searchQuery}
            regionFilter={regionFilter}
            departmentFilter={departmentFilter}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <EmployeeAnalytics regionFilter={regionFilter} departmentFilter={departmentFilter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
