'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { RatingsTable } from '@/components/dashboard/ratings-table';
import { RatingsChart } from '@/components/dashboard/ratings-chart';
import { useRatings } from '@/hooks/use-ratings';
import { Rating } from '@/types/rating';

export default function RatingsPage() {
  const {  publicRatings, isLoading, isError } = useRatings();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  useEffect(()=>{
    console.log(publicRatings)
  },[publicRatings])

  const getAverageRating = (ratings: Rating[]): string => {
    if (ratings.length === 0) return '0.0';

    const total = ratings.reduce((sum, rating) => {
      return sum + (rating.courtesy + rating.punctuality + rating.knowledge) / 3;
    }, 0);

    return (total / ratings.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rating</h2>
          <p className="text-muted-foreground">manage ratings</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <div className="relative">
            <Input
              placeholder="search ratings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 ">
            <Card>
              <CardHeader>
                <CardTitle>{t('averageRating')}</CardTitle>
                <CardDescription>{t('overallAverageRating')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{getAverageRating(publicRatings)}</div>
                <p className="text-sm text-muted-foreground">out of {publicRatings.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{publicRatings.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rating details</CardTitle>
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
