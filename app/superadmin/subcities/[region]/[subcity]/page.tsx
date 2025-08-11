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

export default function SubcityDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const region = params.region as string;
  const subcity = params.subcity as string;

  // Format region and subcity names for display
  const formattedRegion = region
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const formattedSubcity = subcity
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [subcityData, setSubcityData] = useState(null);

  useEffect(() => {
    // Mock data for demonstration
    setSubcityData({
      overview: `${formattedSubcity} is a vibrant subcity in ${formattedRegion}, known for its unique culture and history.`,
      statistics: {
        totalServices: 120,
        activeComplaints: 5,
        completedServices: 115,
      },
    });
  }, [region, subcity]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{formattedSubcity}</h1>
          </div>
          <p className="text-muted-foreground">
            {formattedRegion} &gt; {formattedSubcity}
          </p>
        </div>
        <Button className="w-full md:w-auto rounded-full">
          <Download className="mr-2 h-4 w-4" /> {t('exportSubcityReport')}
        </Button>
      </div>

      {/* Subcity Overview and Statistics */}
      {subcityData && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Overview</h2>
          <p className="mb-4">{subcityData.overview}</p>
          <ul className="mb-4 list-disc list-inside text-base">
            <li>
              <strong>Region:</strong> {formattedRegion}
            </li>
            <li>
              <strong>Subcity:</strong> {formattedSubcity}
            </li>
            <li>
              <strong>Population:</strong> 250,000
            </li>
            <li>
              <strong>Phone:</strong> +251 11 123 4567
            </li>
            <li>
              <strong>Email:</strong> info@{formattedSubcity.toLowerCase()}
              .gov.et
            </li>
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Total Services</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subcityData.statistics.totalServices}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Active Complaints</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subcityData.statistics.activeComplaints}
              </p>
            </div>
            <div className="bg-white dark:bg-[#0a0f1a] p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Completed Services</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subcityData.statistics.completedServices}
              </p>
            </div>
          </div>
        </div>
      )}

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
