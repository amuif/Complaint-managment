'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ServiceFilters } from '@/components/dashboard/service-filters';
import { ServiceGrid } from '@/components/dashboard/service-grid';
import { useLanguage } from '@/components/language-provider';

export default function ServicesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('services')}</h1>
          <p className="text-muted-foreground">{t('manageServicesDesc')}</p>
        </div>
        <Button className="w-full md:w-auto rounded-full">
          <Plus className="mr-2 h-4 w-4" /> {t('addService')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchServices')}
            className="pl-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ServiceFilters
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
        />
      </div>

      {/* Services Grid */}
      <ServiceGrid searchQuery={searchQuery} departmentFilter={departmentFilter} />
    </div>
  );
}
