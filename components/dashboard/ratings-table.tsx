'use client';

import { useRatings } from '@/hooks/use-ratings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Award } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export function RatingsTable() {
  const { ratings, publicRatings, isLoading, isError } = useRatings();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Ratings
          </CardTitle>
          <CardDescription>Latest service ratings from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Ratings
          </CardTitle>
          <CardDescription>Latest service ratings from customers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Unable to load ratings data</p>
        </CardContent>
      </Card>
    );
  }

  // Combine both rating sources and sort by date
  const allRatings = [...(ratings || []), ...(publicRatings || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10); // Show only the 10 most recent

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getAverageRating = (courtesy: number, timeliness: number, knowledge: number) => {
    return ((courtesy + timeliness + knowledge) / 3).toFixed(1);
  };

  const getAverageRatingBadge = (courtesy: number, timeliness: number, knowledge: number) => {
    const avg = (courtesy + timeliness + knowledge) / 3;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Recent Ratings
        </CardTitle>
        <CardDescription>Latest service ratings from customers</CardDescription>
      </CardHeader>
      <CardContent>
        {allRatings.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No ratings available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-muted text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Courtesy
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Timeliness
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Knowledge
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Average
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {allRatings.map((rating, idx) => (
                  <tr
                    key={rating.id}
                    className={`border-b last:border-0 transition-colors ${
                      idx % 2 === 0 ? 'bg-background' : 'bg-muted/50'
                    } hover:bg-primary/5`}
                  >
                    <td className="px-3 py-2 font-medium flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {rating.phone_number ? rating.phone_number.slice(-2) : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{rating.phone_number}</span>
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {rating.Employee?.employee_name || 'Unknown'}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {getRatingStars(rating.courtesy)}
                        <span className="text-xs ml-1">({rating.courtesy})</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {getRatingStars(rating.timeliness)}
                        <span className="text-xs ml-1">({rating.timeliness})</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        {getRatingStars(rating.knowledge)}
                        <span className="text-xs ml-1">({rating.knowledge})</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      {getAverageRatingBadge(rating.courtesy, rating.timeliness, rating.knowledge)}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {format(parseISO(rating.created_at), 'MMM dd')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
