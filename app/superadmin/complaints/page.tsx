'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplaintAnalytics } from '@/components/superadmin/complaint-analytics';
import { ComplaintManagementTable } from '@/components/superadmin/complaint-management-table';
import { ExportDialog } from '@/components/superadmin/export-dialog';
import { ComplaintViewDialog } from '@/components/superadmin/complaint-management/complaint-view-dialog';
import { ComplaintEditDialog } from '@/components/superadmin/complaint-management/complaint-edit-dialog';
import { Complaint } from '@/types/complaint';

export default function ComplaintsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [viewType, setViewType] = useState('list');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('allComplaints')}</h1>
          <p className="text-muted-foreground">{t('allComplaintsDesc')}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ExportDialog
            dataType="complaints"
            filters={{
              regionFilter,
              statusFilter,
              priorityFilter,
              searchQuery,
            }}
            triggerText={t('exportComplaints')}
          />
        </div>
      </div>

      <Tabs defaultValue={viewType} onValueChange={setViewType} className="w-full">
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
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder={t('region')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('region')}</SelectLabel>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
                  <SelectItem value="amhara">Amhara</SelectItem>
                  <SelectItem value="oromia">Oromia</SelectItem>
                  <SelectItem value="tigray">Tigray</SelectItem>
                  <SelectItem value="snnpr">SNNPR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] rounded-full">
                <SelectValue placeholder={t('status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('status')}</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">{t('open')}</SelectItem>
                  <SelectItem value="in-progress">{t('inProgress')}</SelectItem>
                  <SelectItem value="resolved">{t('resolved')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] rounded-full">
                <SelectValue placeholder={t('priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t('priority')}</SelectLabel>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">{t('urgent')}</SelectItem>
                  <SelectItem value="high">{t('high')}</SelectItem>
                  <SelectItem value="medium">{t('medium')}</SelectItem>
                  <SelectItem value="low">{t('low')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="list">{t('list')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="list" className="mt-6">
          <ComplaintManagementTable
            searchQuery={searchQuery}
            regionFilter={regionFilter}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            onViewComplaint={setSelectedComplaint}
            onEditComplaint={setEditingComplaint}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <ComplaintAnalytics
            regionFilter={regionFilter}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
          />
        </TabsContent>
      </Tabs>

      <ComplaintViewDialog
        complaint={selectedComplaint}
        open={!!selectedComplaint}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedComplaint(null);
        }}
      />

      <ComplaintEditDialog
        complaint={editingComplaint}
        open={!!editingComplaint}
        onOpenChange={(open: boolean) => {
          if (!open) setEditingComplaint(null);
        }}
        onSave={(updatedComplaint: Complaint) => {
          console.log('Updated complaint:', updatedComplaint);
          setEditingComplaint(null);
        }}
      />
    </div>
  );
}
