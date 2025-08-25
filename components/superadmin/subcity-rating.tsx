'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Star, MessageSquare, User, Calendar, Building, Users, CheckCircle } from 'lucide-react';
import { useRatings } from '@/hooks/use-ratings';
import { useMemo } from 'react';

interface SubcityRatingProps {
  subcity: string;
}

export function SubcityRating({ subcity }: SubcityRatingProps) {
  const { publicRatings, isLoading, isError, ratings } = useRatings();

  const validRatings = useMemo(() => {
    if (!publicRatings || !Array.isArray(publicRatings)) return [];
    return publicRatings.filter(
      (rating) => rating?.sub_city?.name_en?.toLowerCase() === subcity.toLowerCase()
    );
  }, [publicRatings, subcity]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-7 bg-muted rounded-lg w-32 animate-pulse"></div>
          <div className="h-6 bg-muted rounded-full w-24 animate-pulse"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="h-3 w-3 bg-muted rounded"></div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="animate-pulse space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-4/5"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-foreground">Feedback</h3>
          <Badge variant="destructive">
            <MessageSquare className="w-3 h-3 mr-1" />
            Error
          </Badge>
        </div>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <MessageSquare className="h-12 w-12 text-destructive/60 mx-auto" />
              <p className="text-destructive font-medium">Unable to load feedback data</p>
              <p className="text-muted-foreground text-sm">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-muted-foreground">{rating}/5</span>
      </div>
    );
  };

  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce((sum, rating) => sum + (rating.overall_rating || 0), 0) /
        validRatings.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          {validRatings.length > 0 && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </div>
          )}
          <Badge variant="secondary" className="px-3 py-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            {validRatings.length} {validRatings.length === 1 ? 'review' : 'reviews'}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {validRatings.length === 0 ? (
          <Card className="col-span-full ">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-4">
                <MessageSquare className="h-16 w-16 text-muted-foreground/40 mx-auto" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg">No ratings yet</h4>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          validRatings.slice(0, 6).map((fb) => (
            <Card key={fb.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{fb.full_name}</p>
                      <p className="text-xs text-muted-foreground">{fb.phone_number}</p>
                    </div>
                  </div>
                  {fb.is_verified && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {fb.overall_rating && <div className="mt-2">{renderStars(fb.overall_rating)}</div>}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3">
                    Additional comment: "
                    {fb.additional_comments || 'No additional comments provided'}"
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-muted/50">
                  {fb.sector?.name_en && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building className="h-3 w-3" />
                      <span>Sector: {fb.sector.name_en}</span>
                    </div>
                  )}
                  {fb.division?.name_en && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>Division: {fb.division.name_en}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(parseISO(fb.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {validRatings.length > 6 && (
        <div className="text-center pt-4">
          <Badge variant="outline" className="px-4 py-2">
            Showing 6 of {validRatings.length} reviews
          </Badge>
        </div>
      )}
    </div>
  );
}
