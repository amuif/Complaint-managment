'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { RatingsTable } from '@/components/dashboard/ratings-table';
import { RatingsChart } from '@/components/dashboard/ratings-chart';

export default function RatingsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('ratings')}</h2>
          <p className="text-muted-foreground">{t('manageRatings')}</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <div className="relative">
            <Input
              placeholder={t('searchRatings')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="details">{t('details')}</TabsTrigger>
          <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('averageRating')}</CardTitle>
                <CardDescription>{t('overallAverageRating')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">4.2</div>
                <p className="text-sm text-muted-foreground">{t('outOf5')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('totalRatings')}</CardTitle>
                <CardDescription>{t('numberOfRatings')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">1,245</div>
                <p className="text-sm text-muted-foreground">{t('lastThirtyDays')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('topRatedEmployee')}</CardTitle>
                <CardDescription>{t('highestRatedEmployee')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">John Doe</div>
                <p className="text-sm text-muted-foreground">4.9 {t('outOf5')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('ratingDetails')}</CardTitle>
              <CardDescription>{t('allRatingsDetails')}</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingsTable searchQuery={searchQuery} dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('ratingTrends')}</CardTitle>
              <CardDescription>{t('ratingTrendsOverTime')}</CardDescription>
            </CardHeader>
            <CardContent>
              <RatingsChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
