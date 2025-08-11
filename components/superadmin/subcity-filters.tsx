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
import { useLanguage } from '@/components/language-provider';

interface SubcityFiltersProps {
  regionFilter: string;
  setRegionFilter: (value: string) => void;
}

export function SubcityFilters({ regionFilter, setRegionFilter }: SubcityFiltersProps) {
  const { t } = useLanguage();
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    // Fetch regions or use hardcoded list
    const fetchRegions = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch("/api/regions")
        // const data = await response.json()
        // setRegions(["all", ...data])

        // Hardcoded regions for demo
        setRegions(['all', 'Addis Ababa', 'Dire Dawa', 'Tigray']);
      } catch (error) {
        console.error('Error fetching regions:', error);
        // Fallback regions if API fails
        setRegions(['all', 'Addis Ababa', 'Dire Dawa', 'Amhara', 'Oromia', 'Tigray']);
      }
    };

    fetchRegions();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={regionFilter} onValueChange={setRegionFilter}>
        <SelectTrigger className="w-[180px] rounded-full">
          <SelectValue placeholder={t('region')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('region')}</SelectLabel>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region === 'all' ? t('allRegions') : region}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
