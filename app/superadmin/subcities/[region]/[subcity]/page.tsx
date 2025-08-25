'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Users, FileText, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/components/language-provider';
import { SubcityEmployees } from '@/components/superadmin/subcity-employees';
import { SubcityFeedback } from '@/components/superadmin/subcity-feedback';
import { SubcityComplaints } from '@/components/superadmin/subcity-complaints';
import { SubcityStats } from '@/components/superadmin/subcity-stats';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { sub } from 'date-fns';
import { useEmployees } from '@/hooks/use-employees';
import { useRatings } from '@/hooks/use-ratings';
import { useFeedback } from '@/hooks/use-feedback';
import { useComplaints } from '@/hooks/use-complaints';

export default function SubcityDetailPage() {
  const { t } = useLanguage();
  const { employees } = useEmployees();
  const { publicRatings } = useRatings();
  const { publicFeedback } = useFeedback();
  const { publicComplaints } = useComplaints();
  const params = useParams();
  const region = params.region as string;
  const subcity = params.subcity as string;

  // Format region and subcity names for display
  const formattedRegion = region.toLowerCase().replace('-', ' ');
  const formattedSubcity = subcity.toLowerCase().replace('-', ' ');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight capitalize">{formattedSubcity}</h1>
          </div>
          <p className="text-muted-foreground capitalize">
            {formattedRegion} &gt; {formattedSubcity}
          </p>
        </div>
        <Button className="w-full md:w-auto rounded-full">
          <Download className="mr-2 h-4 w-4" /> {t('exportSubcityReport')}
        </Button>
      </div>

      {/* Subcity Overview and Statistics */}
      <div className="mb-6">
        <ul className="mb-4 list-disc list-inside text-base">
          <li>
            <strong>Region:</strong> <span className="capitalize"> {formattedRegion}</span>
          </li>
          <li>
            <strong>Subcity:</strong> <span className="capitalize">{formattedSubcity}</span>
          </li>
        </ul>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Total Employees</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {
                employees.filter(
                  (employee) =>
                    employee.subcity.name_en.toLowerCase() === formattedSubcity.toLowerCase()
                ).length
              }
            </p>
          </div>
          <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Total Complaints</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {publicComplaints?.filter(
                (complaints) =>
                  complaints?.sub_city?.name_en.toLowerCase() === formattedSubcity.toLowerCase()
              ).length || 0}
            </p>
          </div>

          <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Total Rating</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {
                publicRatings.filter(
                  (rating) => rating.subcity?.toLowerCase() === formattedSubcity.toLowerCase()
                ).length
              }
            </p>
          </div>
          <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-800 dark:text-gray-100">Total Feedback</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {publicFeedback?.feedback.length}{' '}
            </p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      {/* <SubcityStats region={region} subcity={subcity} /> */}

      {/* Tabs for different sections */}
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">
            <Users className="h-4 w-4 mr-2" />
            {t('employees')}
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <FileText className="h-4 w-4 mr-2" />
            {t('feedback')}
          </TabsTrigger>
          <TabsTrigger value="complaints">
            <MessageSquare className="h-4 w-4 mr-2" />
            {t('complaints')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="mt-6">
          <SubcityEmployees subcity={formattedSubcity} />
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <SubcityFeedback subcity={formattedSubcity} />
        </TabsContent>

        <TabsContent value="complaints" className="mt-6">
          <SubcityComplaints subcity={formattedSubcity} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
