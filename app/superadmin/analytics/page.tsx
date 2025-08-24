'use client';

import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { BarChart, PieChart } from '@/components/ui/charts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/hooks/use-organization';
import { useComplaints } from '@/hooks/use-complaints';
import { useEmployees } from '@/hooks/use-employees';
import { useRatings } from '@/hooks/use-ratings';
import { useFeedback } from '@/hooks/use-feedback';
import { useAuth } from '@/hooks/use-auth';

export default function SuperAdminAnalyticsPage() {
  const { t } = useLanguage();
  const { Subcities } = useOrganization();
  const { getAdmins } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const { publicComplaints } = useComplaints();
  const { employees } = useEmployees();
  const { publicRatings } = useRatings();
  const { publicFeedback } = useFeedback();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize Subcities
  const memoizedSubcities = useMemo(() => Subcities || [], [Subcities]);

  // Filter Complaints
  const filteredComplaints = useMemo(() => {
    if (!publicComplaints) return [];
    return publicComplaints.filter((complaint) => {
      const complaintDate = complaint.created_at ? new Date(complaint.created_at) : null;

      const isWithinDateRange =
        !dateRange?.from || !dateRange?.to || !complaintDate
          ? true
          : complaintDate >= dateRange.from && complaintDate <= dateRange.to;

      const isRegionMatch =
        selectedRegion === 'all' ||
        selectedRegion === '' ||
        complaint.sub_city?.id?.toString() === selectedRegion;

      return isWithinDateRange && isRegionMatch;
    });
  }, [publicComplaints, dateRange, selectedRegion]);

  // Filter Feedback
  const filteredFeedback = useMemo(() => {
    if (!publicFeedback?.feedback) return [];
    return publicFeedback.feedback.filter((feedback) => {
      const feedbackDate = feedback.created_at ? new Date(feedback.created_at) : null;

      const isWithinDateRange =
        !dateRange?.from || !dateRange?.to || !feedbackDate
          ? true
          : feedbackDate >= dateRange.from && feedbackDate <= dateRange.to;

      return isWithinDateRange;
    });
  }, [publicFeedback, dateRange]);

  // Filter Ratings
  const filteredRatings = useMemo(() => {
    if (!publicRatings) return [];
    return publicRatings.filter((rating) => {
      const ratingDate = rating.created_at ? new Date(rating.created_at) : null;

      const isWithinDateRange =
        !dateRange?.from || !dateRange?.to || !ratingDate
          ? true
          : ratingDate >= dateRange.from && ratingDate <= dateRange.to;

      return isWithinDateRange;
    });
  }, [publicRatings, dateRange]);

  // Filter Employees
  const filteredEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.filter((employee) => {
      const employeeDate = employee.created_at ? new Date(employee.created_at) : null;

      const isWithinDateRange =
        !dateRange?.from || !dateRange?.to || !employeeDate
          ? true
          : employeeDate >= dateRange.from && employeeDate <= dateRange.to;

      const isRegionMatch =
        selectedRegion === 'all' ||
        selectedRegion === '' ||
        employee?.subcity?.id.toString() === selectedRegion;

      return isWithinDateRange && isRegionMatch;
    });
  }, [employees, dateRange, selectedRegion]);

  // Complaint distribution by region (for bar chart)
  // Complaint distribution by region (for bar chart)
  const complaintData = useMemo(() => {
    if (!filteredComplaints || filteredComplaints.length === 0) {
      return [];
    }

    try {
      const complaintCount: { [key: string]: number } = {};
      filteredComplaints.forEach((complaint) => {
        const subcity = Subcities.find((s) => s.id === complaint.sub_city?.id);
        const regionName = subcity?.name_en ?? 'Unknown';
        complaintCount[regionName] = (complaintCount[regionName] || 0) + 1;
      });

      return Object.entries(complaintCount).map(([name, value]) => ({
        name,
        value,
      }));
    } catch (err) {
      console.error('Error processing complaint data:', err);
      return [];
    }
  }, [filteredComplaints, Subcities]);
  useEffect(() => {
    console.log(publicFeedback?.feedback);
  }, [publicFeedback]);
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t('systemAnalytics') || 'System Analytics'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {memoizedSubcities.length === 0 ? (
            <div className="text-gray-500">
              {t('noSubcitiesAvailable') || 'No subcities available'}
            </div>
          ) : (
            <Select
              value={selectedRegion}
              onValueChange={(value) => setSelectedRegion(value)}
              disabled={memoizedSubcities.length === 0}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('selectRegion') || 'Select Region'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allRegions') || 'All Regions'}</SelectItem>
                {memoizedSubcities.map((subcity) => (
                  <SelectItem key={subcity.id} value={subcity.id.toString()}>
                    {subcity.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalEmployees') || 'Total Employees'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEmployees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalRatings') || 'Total Ratings'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRatings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalComplaints') || 'Total Complaints'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredComplaints.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalFeedback') || 'Total Feedback'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredFeedback.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('overview') || 'Overview'}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('complaintDistribution') || 'Complaint Distribution'}</CardTitle>
                <CardDescription>{t('byRegion') || 'By Region'}</CardDescription>
              </CardHeader>

              <CardContent>
                {complaintData.length === 0 ? (
                  <div className="text-center text-gray-500">
                    {t('noDataAvailable') || 'No data available'}
                  </div>
                ) : (
                  <BarChart data={complaintData} xAxisKey="name" yAxisKey="value" height={400} />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {/* Complaint Status */}
            <Card>
              <CardHeader>
                <CardTitle>Complaint Status</CardTitle>
                <CardDescription>Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    {
                      name: 'Pending',
                      value: filteredComplaints.filter((c) => c.status === 'submitted').length || 0,
                    },
                    {
                      name: t('inProgress') || 'In Progress',
                      value:
                        filteredComplaints.filter((c) => c.status === 'investigating').length || 0,
                    },
                    {
                      name: t('resolved') || 'Resolved',
                      value: filteredComplaints.filter((c) => c.status === 'resolved').length || 0,
                    },
                  ]}
                  nameKey="name"
                  dataKey="value"
                  height={400}
                />
              </CardContent>
            </Card>

            {/* Feedback Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Sentiment</CardTitle>
                <CardDescription>Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    {
                      name: 'Complaint',
                      value:
                        filteredFeedback.filter((f) => f.feedback_type === 'concern').length || 0,
                    },
                    {
                      name: 'Suggestion',
                      value:
                        filteredFeedback.filter((f) => f.feedback_type === 'suggestion').length ||
                        0,
                    },
                    {
                      name: 'Compliment',
                      value:
                        filteredFeedback.filter((f) => f.feedback_type === 'compliment').length ||
                        0,
                    },
                  ]}
                  nameKey="name"
                  dataKey="value"
                  height={400}
                />
              </CardContent>
            </Card>

            {/* User Roles */}
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: 'Super Admin', value: 1 },
                    {
                      name: 'Super Admin supporter',
                      value: getAdmins.filter((admin) => admin.role === 'SuperAdmin').length || 0,
                    },
                    {
                      name: 'Admin',
                      value: getAdmins.filter((admin) => admin.role === 'Admin').length || 0,
                    },
                    {
                      name: 'Editor',
                      value: getAdmins.filter((admin) => admin.role === 'Editor').length || 0,
                    },
                    {
                      name: 'Viewer',
                      value: getAdmins.filter((admin) => admin.role === 'Viewer').length || 0,
                    },
                  ]}
                  nameKey="name"
                  dataKey="value"
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
