'use client';

import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { useComplaints } from '@/hooks/use-complaints';
import { useFeedback } from '@/hooks/use-feedback';
import { useRatings } from '@/hooks/use-ratings';

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [resolvedComplaints, setResolvedComplaints] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const { publicComplaints } = useComplaints();
  const { publicFeedback } = useFeedback();
  const { ratings } = useRatings();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  useEffect(() => {
    const resolved = publicComplaints.filter((complaint) => complaint.status === 'resolved').length;
    setResolvedComplaints(resolved);
  }, [publicComplaints]);
  useEffect(() => {
    if (!ratings || ratings.length === 0) return;

    const total = ratings.reduce((sum, rating) => sum + Number(rating.overall_rating || 0), 0);
    const average = total / ratings.length;

    console.log('Average rating:', average);
  }, [ratings]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('analytics')}</h2>
          <p className="text-muted-foreground">{t('viewAnalytics')}</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="complaints">{t('complaints')}</TabsTrigger>
          <TabsTrigger value="feedback">{t('feedback')}</TabsTrigger>
          <TabsTrigger value="ratings">{t('ratings')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('totalComplaints')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publicComplaints.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('totalFeedback')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publicFeedback?.feedback.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{t('averageRating')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageRating}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resolved complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedComplaints}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('complaintTrends')}</CardTitle>
                <CardDescription>{t('last30Days')}</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: 'Jan 1', value: 45 },
                    { name: 'Jan 5', value: 52 },
                    { name: 'Jan 10', value: 48 },
                    { name: 'Jan 15', value: 61 },
                    { name: 'Jan 20', value: 55 },
                    { name: 'Jan 25', value: 67 },
                    { name: 'Jan 30', value: 62 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('feedbackDistribution')}</CardTitle>
                <CardDescription>{t('byCategory')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: t('positive'), value: 65 },
                    { name: t('neutral'), value: 20 },
                    { name: t('negative'), value: 15 },
                  ]}
                  nameKey="name"
                  dataKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="complaints" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('complaintAnalytics')}</CardTitle>
              <CardDescription>{t('detailedComplaintAnalytics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('complaintsByDepartment')}</h3>
                  <BarChart
                    data={[
                      { name: 'HR', value: 45 },
                      { name: 'Finance', value: 32 },
                      { name: 'IT', value: 28 },
                      { name: 'Operations', value: 52 },
                      { name: 'Customer Service', value: 68 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('complaintResolutionTime')}</h3>
                  <LineChart
                    data={[
                      { name: 'Jan', value: 3.2 },
                      { name: 'Feb', value: 2.8 },
                      { name: 'Mar', value: 2.5 },
                      { name: 'Apr', value: 2.2 },
                      { name: 'May', value: 2.0 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="feedback" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('feedbackAnalytics')}</CardTitle>
              <CardDescription>{t('detailedFeedbackAnalytics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('feedbackByDepartment')}</h3>
                  <BarChart
                    data={[
                      { name: 'HR', value: 65 },
                      { name: 'Finance', value: 42 },
                      { name: 'IT', value: 38 },
                      { name: 'Operations', value: 55 },
                      { name: 'Customer Service', value: 78 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('feedbackSentiment')}</h3>
                  <PieChart
                    data={[
                      { name: t('positive'), value: 65 },
                      { name: t('neutral'), value: 20 },
                      { name: t('negative'), value: 15 },
                    ]}
                    nameKey="name"
                    dataKey="value"
                    height={300}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ratings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('ratingsAnalytics')}</CardTitle>
              <CardDescription>{t('detailedRatingsAnalytics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('averageRatingsByDepartment')}</h3>
                  <BarChart
                    data={[
                      { name: 'HR', value: 4.2 },
                      { name: 'Finance', value: 3.8 },
                      { name: 'IT', value: 4.5 },
                      { name: 'Operations', value: 4.0 },
                      { name: 'Customer Service', value: 4.7 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('ratingDistribution')}</h3>
                  <BarChart
                    data={[
                      { name: '1 Star', value: 5 },
                      { name: '2 Stars', value: 10 },
                      { name: '3 Stars', value: 20 },
                      { name: '4 Stars', value: 35 },
                      { name: '5 Stars', value: 30 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
