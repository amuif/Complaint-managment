'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useComplaints } from '@/hooks/use-complaints';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/hooks/use-organization';

interface ComplaintAnalyticsProps {
  regionFilter: string;
  statusFilter: string;
}

export function ComplaintAnalytics({ regionFilter, statusFilter }: ComplaintAnalyticsProps) {
  const { t } = useLanguage();
  const [chartType, setChartType] = useState('status');

  const { complaints, publicComplaints, isLoading } = useComplaints();
  const { Subcities } = useOrganization();

  // Combine both complaint sources
  const allComplaints = [
    ...(Array.isArray(complaints) ? complaints : []),
    ...(Array.isArray(publicComplaints) ? publicComplaints : []),
  ];

  // Apply filters
  const filteredComplaints = allComplaints.filter((complaint) => {
    const matchesStatus =
      statusFilter === 'all' ||
      complaint.status?.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === 'open' && complaint.status?.toLowerCase() === 'pending') ||
      (statusFilter === 'in-progress' && complaint.status?.toLowerCase() === 'in progress');

    const currentSubcity = Subcities.find((subcity) => subcity.id === regionFilter);
    const matchesRegion =
      regionFilter === 'all' ||
      complaint.sub_city.name_en?.toLowerCase().includes(currentSubcity?.name_en.toLowerCase()!);

    return matchesStatus && matchesRegion;
  });
  useEffect(() => {
    console.log('region', regionFilter);
  }, [regionFilter]);

  // Calculate analytics
  const statusCounts = filteredComplaints.reduce(
    (acc, complaint) => {
      const status = complaint.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'open':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      );
    }

    if (chartType === 'status') {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Card key={status} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold mb-2">{count}</div>
                  <Badge variant="outline" className={getStatusColor(status)}>
                    {status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          {Object.keys(statusCounts).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No complaints found matching the current filters
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 ">
        <Card className="overflow-hidden border-none shadow-md">
          <CardHeader>
            <CardTitle>Summary Statistics</CardTitle>
            <CardDescription>Key metrics for filtered complaints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Complaints:</span>
                <span className="text-2xl font-bold">{filteredComplaints.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Resolved:</span>
                <span className="text-lg font-semibold text-green-600">
                  {filteredComplaints.filter((c) => c.status?.toLowerCase() === 'resolved').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Submitted:</span>
                <span className="text-lg font-semibold text-yellow-600">
                  {filteredComplaints.filter((c) => c.status?.toLowerCase() === 'submitted').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">In Progress:</span>
                <span className="text-lg font-semibold text-blue-600">
                  {
                    filteredComplaints.filter((c) => c.status?.toLowerCase() === 'in progress')
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Resolution Rate:</span>
                <span className="text-lg font-semibold">
                  {filteredComplaints.length > 0
                    ? `${Math.round(
                        (filteredComplaints.filter((c) => c.status?.toLowerCase() === 'resolved')
                          .length /
                          filteredComplaints.length) *
                          100
                      )}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
