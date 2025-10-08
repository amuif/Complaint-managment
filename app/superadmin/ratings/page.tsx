'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays, isWithinInterval, parseISO } from 'date-fns';
import { Star, TrendingUp, Users, Award } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClientOnly } from '@/components/client-only';
import { useRatings } from '@/hooks/use-ratings';

export default function AllRatingsPage() {
  return (
    <ClientOnly>
      <RatingsPageContent />
    </ClientOnly>
  );
}

function RatingsPageContent() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const { publicRatings, isLoading, isError, error } = useRatings();
  // Combine both rating sources
  const allRatings = publicRatings;
  useEffect(() => {
    console.log('public', publicRatings);
  }, [publicRatings]);

  // Calculate average rating for each category
  const getAverageRating = (category: 'courtesy' | 'punctuality' | 'knowledge') => {
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((acc, rating) => acc + (rating[category] || 0), 0);
    return (sum / allRatings.length).toFixed(1);
  };

  const getOverallAverage = () => {
    if (allRatings.length === 0) return 0;
    const sum = allRatings.reduce((acc, rating) => {
      const avg =
        ((rating.courtesy || 0) + (rating.punctuality || 0) + (rating.knowledge || 0)) / 3;
      return acc + avg;
    }, 0);
    return (sum / allRatings.length).toFixed(1);
  };

  const getResponsible = (rating: any) => {
    if (rating?.employee) {
      return `${rating.employee.first_name_en ?? ''} ${rating.employee.last_name_en ?? ''}`.trim();
    }
    if (rating?.department) {
      return rating.department.name_en;
    }
    if (rating?.division) {
      return rating.division.name_en;
    }
    if (rating?.sector) {
      return rating.sector.name_en;
    }
    return 'Unknown';
  };
  const getResponsibleTitle = (rating: any) => {
    if (rating?.employee) {
      return 'Employee';
    }
    if (rating?.department) {
      return 'Team';
    }
    if (rating?.division) {
      return 'Director';
    }
    if (rating?.sector) {
      return 'Sector';
    }
    return 'Unknown';
  };
  // Filter ratings by type and search criteria
  const filterByType = (type: 'all' | 'excellent' | 'good' | 'poor') => {
    return allRatings.filter((rating) => {
      if (!rating) return false;

      const employeeName = rating.Employee?.first_name_en || 'Unknown';
      const searchLower = searchQuery ? searchQuery.toLowerCase() : '';

      const matchesSearch = employeeName.toLowerCase().includes(searchLower);
      const matchesDate =
        !dateRange?.from ||
        !dateRange?.to ||
        !rating.created_at ||
        isWithinInterval(parseISO(rating.created_at), {
          start: dateRange.from,
          end: dateRange.to,
        });

      const avgRating = (rating.courtesy + rating.punctuality + rating.knowledge) / 3;
      let matchesType = true;
      if (type === 'excellent') matchesType = avgRating >= 4;
      else if (type === 'good') matchesType = avgRating >= 3 && avgRating < 4;
      else if (type === 'poor') matchesType = avgRating < 3;

      return matchesSearch && matchesDate && matchesType;
    });
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getAverageRatingBadge = (courtesy: number, punctuality: number, knowledge: number) => {
    const avg = (courtesy + punctuality + knowledge) / 3;
    let className = '';

    if (avg >= 4) {
      className = 'bg-green-100 text-green-700 border-green-200';
    } else if (avg >= 3) {
      className = 'bg-yellow-100 text-yellow-700 border-yellow-200';
    } else {
      className = 'bg-red-100 text-red-700 border-red-200';
    }

    return (
      <Badge variant="outline" className={className}>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {avg.toFixed(1)}
        </div>
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Ratings</h2>
            <p className="text-muted-foreground">Manage and analyze service ratings</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading ratings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">All Ratings</h2>
            <p className="text-muted-foreground">Manage and analyze service ratings</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading ratings: {error?.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const RatingTable = ({ type }: { type: 'all' | 'excellent' | 'good' | 'poor' }) => {
    const filtered = filterByType(type);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-muted text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Name
              </th>

              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Courtesy
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                punctuality
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Knowledge
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Average
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Rated
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-foreground">
                  No ratings found
                </td>
              </tr>
            ) : (
              filtered.map((rating, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-0 transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/50'
                  } hover:bg-primary/5`}
                >
                  <td className="px-4 py-2 font-medium flex items-center gap-2">
                    {rating.full_name || 'Unknown Employee'}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {getRatingStars(rating.courtesy)}
                      <span className="ml-1 text-xs">({rating.courtesy})</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {getRatingStars(rating.punctuality)}
                      <span className="ml-1 text-xs">({rating.punctuality})</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {getRatingStars(rating.knowledge)}
                      <span className="ml-1 text-xs">({rating.knowledge})</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {getAverageRatingBadge(rating.courtesy, rating.punctuality, rating.knowledge)}
                  </td>
                  <td className="px-4 py-2">{getResponsible(rating)}</td>
                  <td className="px-4 py-2">{new Date(rating.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Ratings</h2>
          <p className="text-muted-foreground">Manage and analyze service ratings</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      {/* <div className="flex flex-col gap-4 md:flex-row md:items-center"> */}
      {/*   <Input */}
      {/*     placeholder="Search ratings..." */}
      {/*     value={searchQuery} */}
      {/*     onChange={(e) => setSearchQuery(e.target.value)} */}
      {/*     className="max-w-sm" */}
      {/*   /> */}
      {/*   <DatePickerWithRange value={dateRange} onChange={setDateRange} /> */}
      {/* </div> */}
      {/**/}
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allRatings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Courtesy</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getAverageRating('courtesy')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average punctuality</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getAverageRating('punctuality')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{getOverallAverage()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Ratings</TabsTrigger>
          <TabsTrigger value="excellent">Excellent (4+)</TabsTrigger>
          <TabsTrigger value="good">Good (3-4)</TabsTrigger>
          <TabsTrigger value="poor">Poor (&lt;3)</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <RatingTable type="all" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="excellent">
          <Card>
            <CardContent className="p-0">
              <RatingTable type="excellent" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="good">
          <Card>
            <CardContent className="p-0">
              <RatingTable type="good" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="poor">
          <Card>
            <CardContent className="p-0">
              <RatingTable type="poor" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
