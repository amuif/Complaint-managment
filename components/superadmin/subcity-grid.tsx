'use client';

import { useEffect, useState } from 'react';
import { Search, Building2, Users, MessageSquare, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { useStatistics } from '@/hooks/use-statistics';
import { Skeleton } from '@/components/ui/skeleton';

interface SubcityGridProps {
  searchQuery: string;
  regionFilter: string;
}

interface Subcity {
  id: number;
  name: string;
  region: string;
  population: number;
  employees: number;
  services: number;
  complaints: {
    open: number;
    total: number;
  };
  status: string;
}

export function SubcityGrid({ searchQuery, regionFilter }: SubcityGridProps) {
  const { t } = useLanguage();
  const { statistics, isLoading: isLoadingStats } = useStatistics();
  const [subcities, setSubcities] = useState<Subcity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use mock data enhanced with real statistics if available
    const fetchSubcities = async () => {
      try {
        setLoading(true);

        // Mock data for demo
        const mockSubcities: Subcity[] = [
          {
            id: 1,
            name: 'Arada Sub-City',
            region: 'Addis Ababa',
            population: 250000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 12) : 45,
            services: statistics?.services ? Math.floor(statistics.services / 12) : 18,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 12)
                : 12,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 12) : 78,
            },
            status: 'active',
          },
          {
            id: 2,
            name: 'Bole Sub-City',
            region: 'Addis Ababa',
            population: 320000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 11) : 62,
            services: statistics?.services ? Math.floor(statistics.services / 11) : 24,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 11)
                : 18,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 11) : 105,
            },
            status: 'active',
          },
          {
            id: 3,
            name: 'Kirkos Sub-City',
            region: 'Addis Ababa',
            population: 220000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 13) : 38,
            services: statistics?.services ? Math.floor(statistics.services / 13) : 16,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 13)
                : 8,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 13) : 65,
            },
            status: 'active',
          },
          {
            id: 4,
            name: 'Bahir Dar',
            region: 'Amhara',
            population: 180000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 14) : 32,
            services: statistics?.services ? Math.floor(statistics.services / 14) : 14,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 14)
                : 15,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 14) : 82,
            },
            status: 'active',
          },
          {
            id: 5,
            name: 'Gondar',
            region: 'Amhara',
            population: 150000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 15) : 28,
            services: statistics?.services ? Math.floor(statistics.services / 15) : 12,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 15)
                : 10,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 15) : 68,
            },
            status: 'active',
          },
          {
            id: 6,
            name: 'Adama',
            region: 'Oromia',
            population: 200000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 16) : 35,
            services: statistics?.services ? Math.floor(statistics.services / 16) : 15,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 16)
                : 14,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 16) : 76,
            },
            status: 'active',
          },
          {
            id: 7,
            name: 'Jimma',
            region: 'Oromia',
            population: 170000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 17) : 30,
            services: statistics?.services ? Math.floor(statistics.services / 17) : 13,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 17)
                : 9,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 17) : 62,
            },
            status: 'active',
          },
          {
            id: 8,
            name: 'Mekelle',
            region: 'Tigray',
            population: 190000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 18) : 33,
            services: statistics?.services ? Math.floor(statistics.services / 18) : 14,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 18)
                : 7,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 18) : 58,
            },
            status: 'maintenance',
          },
          {
            id: 9,
            name: 'Hawassa',
            region: 'SNNPR',
            population: 210000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 19) : 36,
            services: statistics?.services ? Math.floor(statistics.services / 19) : 15,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 19)
                : 11,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 19) : 72,
            },
            status: 'active',
          },
          {
            id: 10,
            name: 'Dire Dawa',
            region: 'Dire Dawa',
            population: 230000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 20) : 40,
            services: statistics?.services ? Math.floor(statistics.services / 20) : 17,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 20)
                : 13,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 20) : 85,
            },
            status: 'active',
          },
          {
            id: 11,
            name: 'Harar',
            region: 'Harari',
            population: 120000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 21) : 25,
            services: statistics?.services ? Math.floor(statistics.services / 21) : 10,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 21)
                : 6,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 21) : 45,
            },
            status: 'inactive',
          },
          {
            id: 12,
            name: 'Semera',
            region: 'Afar',
            population: 90000,
            employees: statistics?.employees ? Math.floor(statistics.employees / 22) : 20,
            services: statistics?.services ? Math.floor(statistics.services / 22) : 8,
            complaints: {
              open: statistics?.pendingComplaints
                ? Math.floor(statistics.pendingComplaints / 22)
                : 5,
              total: statistics?.complaints ? Math.floor(statistics.complaints / 22) : 38,
            },
            status: 'active',
          },
        ];

        setSubcities(mockSubcities);
      } catch (error) {
        console.error('Error fetching subcities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcities();
  }, [statistics]);

  // Filter subcities based on search query and region
  const filteredSubcities = subcities.filter((subcity) => {
    const matchesSearch =
      subcity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcity.region.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = regionFilter === 'all' || subcity.region === regionFilter;

    return matchesSearch && matchesRegion;
  });

  if (loading || isLoadingStats) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'maintenance':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubcities.map((subcity) => (
          <Card key={subcity.id} className="overflow-hidden border-none shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{subcity.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor(subcity.status)}>
                  {subcity.status.charAt(0).toUpperCase() + subcity.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{subcity.region}</p>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('employees')}</p>
                    <p className="font-medium">{subcity.employees}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('feedback')}</p>
                    <p className="font-medium">{subcity.services}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('openComplaints')}</p>
                    <p className="font-medium">{subcity.complaints.open}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('population')}</p>
                    <p className="font-medium">{subcity.population.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <Button variant="outline" size="sm">
                {t('manageAdmins')}
              </Button>
              <Button variant="default" size="sm">
                {t('viewDetails')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredSubcities.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{t('noSubcitiesFound')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('adjustFiltersSubcities')}</p>
        </div>
      )}
    </>
  );
}
