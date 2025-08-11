'use client';

import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SuperAdminAnalyticsPage() {
  const { t } = useLanguage();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('systemAnalytics')}</h2>
          <p className="text-muted-foreground">{t('comprehensiveSystemAnalytics')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('selectRegion')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allRegions')}</SelectItem>
              <SelectItem value="addis-ababa">Addis Ababa</SelectItem>
              <SelectItem value="dire-dawa">Dire Dawa</SelectItem>
              <SelectItem value="amhara">Amhara</SelectItem>
              <SelectItem value="oromia">Oromia</SelectItem>
              <SelectItem value="tigray">Tigray</SelectItem>
              <SelectItem value="snnpr">SNNPR</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+15.2% {t('fromLastMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalEmployees')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">+8.7% {t('fromLastMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('totalComplaints')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">+12.3% {t('fromLastMonth')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('systemHealth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">+0.5% {t('fromLastMonth')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="regional">{t('regionalAnalysis')}</TabsTrigger>
          <TabsTrigger value="performance">{t('systemPerformance')}</TabsTrigger>
          <TabsTrigger value="users">{t('userAnalytics')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('complaintDistribution')}</CardTitle>
                <CardDescription>{t('byRegion')}</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={[
                    { name: 'Addis Ababa', value: 1245 },
                    { name: 'Dire Dawa', value: 876 },
                    { name: 'Amhara', value: 765 },
                    { name: 'Oromia', value: 987 },
                    { name: 'Tigray', value: 543 },
                    { name: 'SNNPR', value: 654 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('systemUsage')}</CardTitle>
                <CardDescription>{t('last30Days')}</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={[
                    { name: 'Jan 1', value: 1245 },
                    { name: 'Jan 5', value: 1352 },
                    { name: 'Jan 10', value: 1548 },
                    { name: 'Jan 15', value: 1761 },
                    { name: 'Jan 20', value: 1855 },
                    { name: 'Jan 25', value: 2067 },
                    { name: 'Jan 30', value: 2162 },
                  ]}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('complaintStatus')}</CardTitle>
                <CardDescription>{t('distribution')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: t('pending'), value: 35 },
                    { name: t('inProgress'), value: 25 },
                    { name: t('resolved'), value: 40 },
                  ]}
                  nameKey="name"
                  dataKey="value"
                  height={250}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('feedbackSentiment')}</CardTitle>
                <CardDescription>{t('distribution')}</CardDescription>
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
                  height={250}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('userRoles')}</CardTitle>
                <CardDescription>{t('distribution')}</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: t('superAdmin'), value: 5 },
                    { name: t('subCityAdmin'), value: 25 },
                    { name: t('employees'), value: 70 },
                  ]}
                  nameKey="name"
                  dataKey="value"
                  height={250}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="regional" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('regionalAnalysis')}</CardTitle>
              <CardDescription>{t('detailedRegionalAnalysis')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('complaintsByRegion')}</h3>
                  <BarChart
                    data={[
                      { name: 'Addis Ababa', value: 1245 },
                      { name: 'Dire Dawa', value: 876 },
                      { name: 'Amhara', value: 765 },
                      { name: 'Oromia', value: 987 },
                      { name: 'Tigray', value: 543 },
                      { name: 'SNNPR', value: 654 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('averageRatingsByRegion')}</h3>
                  <BarChart
                    data={[
                      { name: 'Addis Ababa', value: 4.2 },
                      { name: 'Dire Dawa', value: 3.8 },
                      { name: 'Amhara', value: 4.5 },
                      { name: 'Oromia', value: 4.0 },
                      { name: 'Tigray', value: 3.9 },
                      { name: 'SNNPR', value: 4.3 },
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
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('systemPerformance')}</CardTitle>
              <CardDescription>{t('detailedSystemPerformance')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('responseTime')}</h3>
                  <LineChart
                    data={[
                      { name: 'Jan 1', value: 120 },
                      { name: 'Jan 5', value: 115 },
                      { name: 'Jan 10', value: 105 },
                      { name: 'Jan 15', value: 95 },
                      { name: 'Jan 20', value: 90 },
                      { name: 'Jan 25', value: 85 },
                      { name: 'Jan 30', value: 80 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('serverLoad')}</h3>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('userAnalytics')}</CardTitle>
              <CardDescription>{t('detailedUserAnalytics')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('userGrowth')}</h3>
                  <LineChart
                    data={[
                      { name: 'Jan', value: 10245 },
                      { name: 'Feb', value: 10876 },
                      { name: 'Mar', value: 11432 },
                      { name: 'Apr', value: 11987 },
                      { name: 'May', value: 12345 },
                    ]}
                    xAxisKey="name"
                    yAxisKey="value"
                    height={300}
                  />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-medium">{t('activeUsers')}</h3>
                  <LineChart
                    data={[
                      { name: 'Jan 1', value: 5245 },
                      { name: 'Jan 5', value: 5352 },
                      { name: 'Jan 10', value: 5548 },
                      { name: 'Jan 15', value: 5761 },
                      { name: 'Jan 20', value: 5855 },
                      { name: 'Jan 25', value: 6067 },
                      { name: 'Jan 30', value: 6162 },
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
