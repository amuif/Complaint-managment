'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ComplaintFilters } from '@/components/dashboard/complaint-filters';
import { ComplaintList } from '@/components/dashboard/complaint-list';
import { ComplaintStats } from '@/components/dashboard/complaint-stats';
import { useLanguage } from '@/components/language-provider';

export default function ComplaintsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('complaints')}</h1>
          <p className="text-muted-foreground">{t('manageComplaintsDesc')}</p>
        </div>
      </div>

      <ComplaintStats />

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchComplaints')}
            className="pl-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ComplaintFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      </div>

      {/* Complaints List */}
      <ComplaintList
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
      />
    </div>
  );
}
