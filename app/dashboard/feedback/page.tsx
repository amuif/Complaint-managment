'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { FeedbackList } from '@/components/dashboard/feedback-list';

export default function FeedbackPage() {
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
          <h2 className="text-2xl font-bold tracking-tight">{t('feedback')}</h2>
          <p className="text-muted-foreground">{t('manageFeedback')}</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
          <div className="relative">
            <Input
              placeholder={t('searchFeedback')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[200px] lg:w-[300px]"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">{t('allFeedback')}</TabsTrigger>
          <TabsTrigger value="positive">{t('positiveFeedback')}</TabsTrigger>
          <TabsTrigger value="negative">{t('negativeFeedback')}</TabsTrigger>
          <TabsTrigger value="neutral">{t('neutralFeedback')}</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('allFeedback')}</CardTitle>
              <CardDescription>{t('viewAllFeedback')}</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackList searchQuery={searchQuery} dateRange={dateRange} type="all" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="positive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('positiveFeedback')}</CardTitle>
              <CardDescription>{t('viewPositiveFeedback')}</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackList searchQuery={searchQuery} dateRange={dateRange} type="positive" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="negative" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('negativeFeedback')}</CardTitle>
              <CardDescription>{t('viewNegativeFeedback')}</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackList searchQuery={searchQuery} dateRange={dateRange} type="negative" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="neutral" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('neutralFeedback')}</CardTitle>
              <CardDescription>{t('viewNeutralFeedback')}</CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackList searchQuery={searchQuery} dateRange={dateRange} type="neutral" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
