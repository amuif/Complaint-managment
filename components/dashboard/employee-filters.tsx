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

interface EmployeeFiltersProps {
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
}

export function EmployeeFilters({ departmentFilter, setDepartmentFilter }: EmployeeFiltersProps) {
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    // Fetch departments from the JSON file
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        const data = await response.json();
        setDepartments(['all', ...data]);
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback departments if API fails
        setDepartments([
          'all',
          'Customer Relations',
          'Front Office',
          'Administration',
          'IT Department',
          'Quality Assurance',
        ]);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger className="w-[180px] rounded-full">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Department</SelectLabel>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department === 'all' ? 'All Departments' : department}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
