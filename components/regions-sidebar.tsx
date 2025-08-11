'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { useRouter, usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

// Mock data for regions and their complaint ratings
const regionsData = {
  'Addis Ababa': {
    subRegions: ['Arada', 'Kirkos', 'Lideta', 'Bole'],
    totalComplaints: 150,
    resolvedComplaints: 120,
    averageRating: 4.2,
    recentComplaints: [
      { id: 1, title: 'የአገልግሎት ዘግይት', rating: 4, status: 'ተፈታ' },
      { id: 2, title: 'ኔትዎርክ ችግር', rating: 3, status: 'በሂደት ላይ' },
      { id: 3, title: 'የክፍያ ችግር', rating: 5, status: 'ተፈታ' },
    ],
    employeeStats: {
      totalEmployees: 45,
      averagePerformance: 4.3,
      topPerformers: 12,
      trainingNeeded: 5,
    },
    officeInfo: {
      address: 'ቦሌ መንገድ, አዲስ አበባ',
      contactNumber: '+251 11 123 4567',
      email: 'addis.office@company.com',
      workingHours: '2:00 ሰዓት - 11:00 ሰዓት (LT)',
    },
  },
  Oromia: {
    subRegions: ['Jimma', 'Adama', 'Bishoftu'],
    totalComplaints: 95,
    resolvedComplaints: 80,
    averageRating: 4.0,
    recentComplaints: [
      { id: 1, title: 'የአገልግሎት ጥራት', rating: 4, status: 'ተፈታ' },
      { id: 2, title: 'ቴክኒካል ድጋፍ', rating: 3, status: 'በሂደት ላይ' },
      { id: 3, title: 'ኔትዎርክ አካባቢ', rating: 4, status: 'ተፈታ' },
    ],
    employeeStats: {
      totalEmployees: 35,
      averagePerformance: 4.1,
      topPerformers: 8,
      trainingNeeded: 7,
    },
    officeInfo: {
      address: 'ጅማ መንገድ, ኦሮሚያ',
      contactNumber: '+251 47 111 2233',
      email: 'oromia.office@company.com',
      workingHours: '2:00 ሰዓት - 11:00 ሰዓት (LT)',
    },
  },
  Amhara: {
    subRegions: ['Bahir Dar', 'Gondar', 'Dessie'],
    totalComplaints: 110,
    resolvedComplaints: 90,
    averageRating: 4.1,
    recentComplaints: [
      { id: 1, title: 'የደንበኞች አገልግሎት', rating: 5, status: 'ተፈታ' },
      { id: 2, title: 'የክፍያ ችግር', rating: 3, status: 'በሂደት ላይ' },
      { id: 3, title: 'የአገልግሎት ጥራት', rating: 4, status: 'ተፈታ' },
    ],
    employeeStats: {
      totalEmployees: 40,
      averagePerformance: 4.2,
      topPerformers: 10,
      trainingNeeded: 6,
    },
    officeInfo: {
      address: 'ባህር ዳር, አማራ',
      contactNumber: '+251 58 222 3344',
      email: 'amhara.office@company.com',
      workingHours: '2:00 ሰዓት - 11:00 ሰዓት (LT)',
    },
  },
};

// Map region slugs to region keys
const regionKeyMap: Record<string, string> = {
  'addis-ababa': 'Addis Ababa',
  oromia: 'Oromia',
  amhara: 'Amhara',
  'dire-dawa': 'Dire Dawa',
};

export function RegionsSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRegion, setSelectedRegion] = useState('Addis Ababa');
  const [selectedSubRegion, setSelectedSubRegion] = useState('Arada');

  // Extract region and subregion from pathname
  const pathParts = pathname.split('/');
  const currentRegionSlug = pathParts[3]?.toLowerCase() || 'addis-ababa';
  const currentRegion = regionKeyMap[currentRegionSlug] || 'Addis Ababa';
  const currentSubRegion =
    pathParts[4]?.replace(/-/g, ' ') || regionsData[currentRegion].subRegions[0];

  // Mock feedback and ratings for demonstration
  const mockFeedback = [
    {
      id: 1,
      user: 'Abebe Kebede',
      comment: 'አገልግሎቱ በጣም ጥሩ ነበር!',
      date: '2024-06-01',
    },
    {
      id: 2,
      user: 'Muluwork Tadesse',
      comment: 'ማቅረብ ይቻላል።',
      date: '2024-06-02',
    },
  ];
  const mockRatings = [
    { id: 1, user: 'Abebe Kebede', rating: 5, date: '2024-06-01' },
    { id: 2, user: 'Muluwork Tadesse', rating: 4, date: '2024-06-02' },
  ];

  const handleRegionClick = (region: string) => {
    const formattedRegion = region.toLowerCase().replace(/\s+/g, '-');
    const defaultSubRegion = regionsData[region].subRegions[0].toLowerCase().replace(/\s+/g, '-');
    router.push(`/superadmin/regions/${formattedRegion}/${defaultSubRegion}`);
    setSelectedRegion(region);
    setSelectedSubRegion(regionsData[region].subRegions[0]);
  };

  const handleSubRegionClick = (subRegion: string) => {
    const formattedRegion = selectedRegion.toLowerCase().replace(/\s+/g, '-');
    const formattedSubRegion = subRegion.toLowerCase().replace(/\s+/g, '-');
    router.push(`/superadmin/regions/${formattedRegion}/${formattedSubRegion}`);
    setSelectedSubRegion(subRegion);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 border-r p-4">
        <h2 className="mb-4 text-lg font-semibold">Sub Cities</h2>
        <div className="space-y-2">
          {Object.keys(regionsData).map((region) => (
            <Collapsible key={region} defaultOpen={currentRegion === region}>
              <CollapsibleTrigger asChild>
                <button
                  className={`w-full flex items-center justify-between rounded-lg p-2 text-left transition-colors ${
                    currentRegion === region
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleRegionClick(region)}
                >
                  <span>{region}</span>
                  <ChevronDown
                    className={`ml-2 h-4 w-4 transition-transform ${
                      currentRegion === region ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-4 mt-2 space-y-1">
                  {regionsData[region].subRegions.map((subRegion) => (
                    <button
                      key={subRegion}
                      onClick={() => handleSubRegionClick(subRegion)}
                      className={`w-full rounded-lg p-2 text-left text-sm transition-colors ${
                        currentSubRegion === subRegion
                          ? 'bg-secondary text-secondary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {subRegion}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <h1 className="mb-6 text-3xl font-bold">{currentSubRegion}</h1>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {regionsData[currentRegion].totalComplaints}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {regionsData[currentRegion].resolvedComplaints}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {regionsData[currentRegion].averageRating}/5
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Employees:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].employeeStats.totalEmployees}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Performance:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].employeeStats.averagePerformance}
                        /5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Performers:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].employeeStats.topPerformers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Training Needed:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].employeeStats.trainingNeeded}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Address:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].officeInfo.address}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].officeInfo.contactNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].officeInfo.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Working Hours:</span>
                      <span className="font-medium">
                        {regionsData[currentRegion].officeInfo.workingHours}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Complaints - {currentSubRegion}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {regionsData[currentRegion].recentComplaints.map((complaint) => (
                      <div
                        key={complaint.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <p className="font-medium">{complaint.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Rating: {complaint.rating}/5
                          </p>
                        </div>
                        <div
                          className={`rounded-full px-2 py-1 text-xs ${
                            complaint.status === 'ተፈታ'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {complaint.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Feedback - {currentSubRegion}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {mockFeedback.map((fb) => (
                      <div key={fb.id} className="rounded-lg border p-4">
                        <div className="flex justify-between">
                          <span className="font-medium">{fb.user}</span>
                          <span className="text-xs text-muted-foreground">{fb.date}</span>
                        </div>
                        <p className="mt-2">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <Card>
              <CardHeader>
                <CardTitle>Ratings - {currentSubRegion}</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {mockRatings.map((rating) => (
                      <div
                        key={rating.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <span className="font-medium">{rating.user}</span>
                          <span className="ml-2 text-yellow-500">{'★'.repeat(rating.rating)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{rating.date}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
