'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { ServiceCard } from '@/components/dashboard/service-card';
import type { Service } from '@/types/service';
import { useLanguage } from '@/components/language-provider';

interface ServiceGridProps {
  searchQuery: string;
  departmentFilter: string;
}

export function ServiceGrid({ searchQuery, departmentFilter }: ServiceGridProps) {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch services from the JSON file
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search query and department
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = departmentFilter === 'all' || service.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return <div className="text-center py-8">{t('loadingServices')}</div>;
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t('noServicesFound')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('adjustFiltersServices')}</p>
        </div>
      )}
    </>
  );
}
