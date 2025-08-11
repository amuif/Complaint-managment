'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceAnalyticsProps {
  regionFilter: string;
  departmentFilter: string;
}

export function ServiceAnalytics({ regionFilter, departmentFilter }: ServiceAnalyticsProps) {
  // Mock data for demonstration
  const stats = [
    { label: 'Total Services', value: 42 },
    { label: 'Active Services', value: 37 },
    { label: 'Inactive Services', value: 5 },
    { label: 'Avg. Rating', value: '4.3/5' },
  ];

  // In a real application, you would filter or fetch data based on these filters
  console.log('Filters applied:', { regionFilter, departmentFilter });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
