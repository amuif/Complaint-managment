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

interface ComplaintFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

export function ComplaintFilters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: ComplaintFiltersProps) {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);

  useEffect(() => {
    // Fetch statuses and priorities from the API
    const fetchFilters = async () => {
      try {
        const statusResponse = await fetch('/api/complaint-statuses');
        const statusData = await statusResponse.json();
        setStatuses(['all', ...statusData]);

        const priorityResponse = await fetch('/api/complaint-priorities');
        const priorityData = await priorityResponse.json();
        setPriorities(['all', ...priorityData]);
      } catch (error) {
        console.error('Error fetching filters:', error);
        // Fallback values if API fails
        setStatuses(['all', 'Open', 'In Progress', 'Under Review', 'Resolved']);
        setPriorities(['all', 'Urgent', 'High', 'Medium', 'Low']);
      }
    };

    fetchFilters();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[140px] rounded-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
        <SelectTrigger className="w-[140px] rounded-full">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
