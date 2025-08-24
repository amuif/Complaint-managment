'use client';

import { useState } from 'react';
import { Download, TrendingUp, Users, FileText, MessageSquare, Star } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SuperAdminChart } from '@/components/superadmin/superadmin-chart';
import { SystemAlerts } from '@/components/superadmin/system-alerts';
import { RecentActivitySuperAdmin } from '@/components/superadmin/recent-activity';
import ExportAllDialog from '@/components/export-all-dialog';
// Import hooks for real data
import { useStatistics } from '@/hooks/use-statistics';
import { useComplaints } from '@/hooks/use-complaints';
import { useFeedback } from '@/hooks/use-feedback';
import { useRatings } from '@/hooks/use-ratings';
import { useEmployees } from '@/hooks/use-employees';
import { ExportDialog } from '@/components/superadmin/export-dialog';
// import { useEmployees } from "@/hooks/use-employees";

export default function SuperAdminDashboardPage() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('monthly');

  // Get real data from hooks
  const { statistics, isLoading: statsLoading } = useStatistics();
  const { complaints, publicComplaints, isLoading: complaintsLoading } = useComplaints();
  const { feedback, publicFeedback, isLoading: feedbackLoading } = useFeedback();
  const { ratings, publicRatings, isLoading: ratingsLoading } = useRatings();
  const { employees, isLoading: employeesLoading } = useEmployees();

  // Calculate metrics from real data
  const totalComplaints = publicComplaints?.length || 0;
  const resolvedComplaints = [
    ...(Array.isArray(complaints) ? complaints : []),
    ...(Array.isArray(publicComplaints) ? publicComplaints : []),
  ].filter((c) => c.status?.toLowerCase() === 'resolved').length;
  const totalFeedback = (feedback?.length || 0) + (publicFeedback?.length || 0);
  const totalEmployees = employees?.length || 0;

  // Calculate average rating
  const allRatings = [
    ...(Array.isArray(ratings) ? ratings : []),
    ...(Array.isArray(publicRatings) ? publicRatings : []),
  ];
  const averageRating =
    allRatings.length > 0
      ? (
          allRatings.reduce((acc, rating) => {
            const avg =
              ((rating.courtesy || 0) + (rating.punctuality || 0) + (rating.knowledge || 0)) / 3;
            return acc + avg;
          }, 0) / allRatings.length
        ).toFixed(1)
      : '0.0';

  const isLoading =
    statsLoading || complaintsLoading || feedbackLoading || ratingsLoading || employeesLoading;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    isLoading,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    isLoading?: boolean;
  }) => (
    <Card className="sleek-card border-none bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900 transition-all duration-300 hover:scale-[1.02] rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={`rounded-xl ${color} p-3`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded-lg w-16 mt-1"></div>
            </div>
          ) : (
            <p className="mt-1 text-2xl font-bold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('superAdminDashboard')}</h1>
          <p className="text-muted-foreground">{t('superAdminDashboardDesc')}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ExportAllDialog />{' '}
        </div>
      </div>

      {/* System Alerts */}
      {/* <SystemAlerts /> */}

      {/* Stats cards - With real data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title={t('totalComplaints')}
          value={totalComplaints.toLocaleString()}
          icon={MessageSquare}
          color="bg-red-500/10 text-red-500"
          isLoading={isLoading}
        />

        <StatCard
          title={t('resolvedComplaints')}
          value={resolvedComplaints.toLocaleString()}
          icon={TrendingUp}
          color="bg-green-500/10 text-green-500"
          isLoading={isLoading}
        />

        <StatCard
          title={t('totalFeedback')}
          value={totalFeedback}
          icon={FileText}
          color="bg-blue-500/10 text-blue-500"
          isLoading={isLoading}
        />

        <StatCard
          title={t('averageRating')}
          value={allRatings.length}
          icon={Star}
          color="bg-amber-500/10 text-amber-500"
          isLoading={isLoading}
        />

        <StatCard
          title={t('totalEmployees')}
          value={totalEmployees}
          icon={Users}
          color="bg-blue-500/10 text-blue-500"
          isLoading={isLoading}
        />
      </div>

      {/* Charts and maps */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7 overflow-hidden border-none bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('addisAbabaSystemMetrics') || 'System-wide Metrics'}</CardTitle>
                <CardDescription>
                  {t('addisAbabaSystemMetricsDesc') ||
                    'Key performance metrics across all departments.'}
                </CardDescription>
              </div>
              <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[200px]">
                <TabsList className="grid w-full grid-cols-3 rounded-lg">
                  <TabsTrigger value="weekly" className="rounded-lg">
                    {t('weekly')}
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="rounded-lg">
                    {t('monthly')}
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="rounded-lg">
                    {t('yearly')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <SuperAdminChart timeRange={timeRange} />
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('systemWideActivity')}</CardTitle>
              <CardDescription>{t('systemWideActivityDesc')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              {t('viewAll')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RecentActivitySuperAdmin />
        </CardContent>
      </Card>
    </div>
  );
}
