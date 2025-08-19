'use client';

import { Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useComplaints } from '@/hooks/use-complaints';

interface ComplaintFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

const ALL_STATUSES = ['submitted', 'under_review', 'investigating', 'resolved', 'closed'];

const ALL_PRIORITIES = ['low', 'normal', 'high', 'urgent'];

export function ComplaintFilters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: ComplaintFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px] rounded-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {['all', ...ALL_STATUSES].map((s) => (
              <SelectItem key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-[140px] rounded-full">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            {['all', ...ALL_PRIORITIES].map((p) => (
              <SelectItem key={p} value={p}>
                {p === 'all' ? 'All Priorities' : p}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
