'use client';

import { useSubcityFeedback } from '@/hooks/use-subcity';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { Star, MessageSquare, User } from 'lucide-react';
import { useFeedback } from '@/hooks/use-feedback';

interface SubcityFeedbackProps {
  subcity: string;
}

export function SubcityFeedback({ subcity }: SubcityFeedbackProps) {
  const { feedback, publicFeedback, isLoading, isError } = useFeedback();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Feedback</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full mb-1"></div>
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
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Feedback</h3>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Unable to load feedback data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine both feedback sources
  const allFeedback = [
    ...(Array.isArray(feedback) ? feedback : []),
    ...(Array.isArray(publicFeedback) ? publicFeedback : []),
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Feedback</h3>
        <Badge variant="secondary">
          <MessageSquare className="w-3 h-3 mr-1" />
          {allFeedback.length} feedback
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allFeedback.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No feedback found for {subcity}</p>
            </CardContent>
          </Card>
        ) : (
          allFeedback.slice(0, 6).map((fb) => (
            <Card key={fb.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      #<span className="text-sm font-medium">{fb.phone_number}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {fb.feedback_text || fb.comment}
                  </p>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Sector: {fb?.sector?.name_en}</div>
                    <div>Director: {fb?.division?.name_en}</div>
                    <div>Date: {format(parseISO(fb.created_at), 'MMM dd, yyyy')}</div>
                  </div>

                  {fb.response_text && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        Response: {fb.response_text}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
