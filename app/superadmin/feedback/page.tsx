'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';
import { addDays, isWithinInterval, parseISO } from 'date-fns';
import { Star } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ClientOnly } from '@/components/client-only';
import { useFeedback } from '@/hooks/use-feedback';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageCircle, Send } from 'lucide-react';
import { Loader } from '@/components/ui/loader';
import { Feedback } from '@/types/feedback';

// Updated type for feedback data from backend

export default function AllFeedbackPage() {
  return (
    <ClientOnly>
      <FeedbackPageContent />
    </ClientOnly>
  );
}

function FeedbackPageContent() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [responseDialog, setResponseDialog] = useState<{
    isOpen: boolean;
    feedback: Feedback | null;
  }>({ isOpen: false, feedback: null });
  const [responseText, setResponseText] = useState('');

  const {
    feedback,
    publicFeedback,
    isLoading,
    isError,
    error,
    respondToFeedback,
    respondToPublicFeedback,
    isRespondingToFeedback,
    isRespondingToPublicFeedback,
  } = useFeedback();

  // Safely combine both feedback sources
  const allFeedback = [
    ...(Array.isArray(feedback) ? feedback : []),
    ...(Array.isArray(publicFeedback) ? publicFeedback : []),
  ];

  useEffect(() => console.log(feedback), [allFeedback]);
  useEffect(() => {
    console.log(responseDialog.feedback);
  }, [responseDialog]);
  // Filter feedback by type and search criteria
  const filterByType = (type: 'all' | 'positive' | 'negative' | 'neutral') => {
    return allFeedback.filter((fb) => {
      if (!fb) return false;

      // Map feedback_type to sentiment category
      const sentimentMap: Record<Feedback['feedback_type'], 'positive' | 'negative' | 'neutral'> = {
        compliment: 'positive',
        concern: 'negative',
        suggestion: 'neutral',
      };

      const sentiment = sentimentMap[fb.feedback_type];

      if (type !== 'all' && sentiment !== type) return false;

      const employeeName = fb.employee
        ? `${fb.employee.first_name_en} ${fb.employee.last_name_en} `
        : 'Unknown';
      const searchLower = searchQuery ? searchQuery.toLowerCase() : '';

      const matchesSearch =
        employeeName.toLowerCase().includes(searchLower) ||
        fb.feedback_text.toLowerCase().includes(searchLower) ||
        fb.subcity?.name_en.toLowerCase().includes(searchLower);

      const matchesDate =
        !dateRange?.from ||
        !dateRange?.to ||
        !fb.created_at ||
        isWithinInterval(parseISO(fb.created_at), {
          start: dateRange.from,
          end: dateRange.to,
        });

      return matchesSearch && matchesDate;
    });
  };
  const getRatingBadge = (rating: number | null) => {
    if (!rating) return null;

    let variant = 'outline';
    let className = '';

    if (rating >= 4) {
      className = 'bg-green-100 text-green-700 border-green-200';
    } else if (rating <= 2) {
      className = 'bg-red-100 text-red-700 border-red-200';
    } else {
      className = 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }

    return (
      <Badge variant={variant as any} className={className}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-current' : ''}`} />
        ))}
        <span className="ml-1">({rating})</span>
      </Badge>
    );
  };

  const handleRespond = (feedback: any) => {
    setResponseDialog({ isOpen: true, feedback });
    setResponseText('');
  };

  const handleSubmitResponse = () => {
    if (!responseDialog.feedback || !responseText.trim()) {
      console.error('Invalid input: responseDialog.feedback is null or responseText is empty', {
        responseDialog,
        responseText,
      });
      return;
    }
    const isPublicFeedback = responseDialog.feedback?.feedback_source === 'public_feedback';

    if (isPublicFeedback) {
      respondToPublicFeedback({
        id: responseDialog.feedback.id,
        response: responseText.trim(),
      });
    } else {
      respondToFeedback({
        id: responseDialog.feedback.id,
        response: responseText.trim(),
      });
    }

    setResponseDialog({ isOpen: false, feedback: null });
    setResponseText('');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('allFeedback')}</h2>
            <p className="text-muted-foreground">{t('manageFeedback')}</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader size="md" text="Loading feedback..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t('allFeedback')}</h2>
            <p className="text-muted-foreground">{t('manageFeedback')}</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading feedback: {error?.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const FeedbackTable = ({ type }: { type: 'all' | 'positive' | 'negative' | 'neutral' }) => {
    const filtered = filterByType(type);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-muted text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Contact
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Full name
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Feedback type
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Comment
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground">
                  No feedback found
                </td>
              </tr>
            ) : (
              filtered.map((fb, idx) => (
                <tr
                  key={fb.id}
                  className={`border-b last:border-0 transition-colors ${
                    idx % 2 === 0 ? 'bg-background' : 'bg-muted/50'
                  } hover:bg-primary/5`}
                >
                  <td className="px-4 py-2 font-medium flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {fb.phone_number ? fb.phone_number.slice(-2) : '??'}
                      </AvatarFallback>
                    </Avatar>
                    <span>{fb.phone_number}</span>
                  </td>

                  <td className="px-4 py-2">{fb?.full_name || 'anonymus'}</td>
                  <td className="px-4 py-2">{fb?.feedback_type || 'unassigned'}</td>
                  <td
                    className="px-4 py-2 max-w-xs truncate"
                    title={fb.feedback_text}
                    style={{ whiteSpace: 'normal' }}
                  >
                    {fb.feedback_text}
                  </td>

                  <td className="px-4 py-2">{new Date(fb.created_at).toLocaleDateString()}</td>
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
          <h2 className="text-2xl font-bold tracking-tight">All Feedback</h2>
          <p className="text-muted-foreground">Manage and respond to feedback</p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      {/* <div className="flex flex-col gap-4 md:flex-row md:items-center"> */}
      {/*   <Input */}
      {/*     placeholder="Search feedback..." */}
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
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allFeedback.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filterByType('positive').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{filterByType('negative').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {filterByType('neutral').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="positive">Positive</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
          <TabsTrigger value="neutral">Neutral</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <FeedbackTable type="all" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="positive">
          <Card>
            <CardContent className="p-0">
              <FeedbackTable type="positive" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="negative">
          <Card>
            <CardContent className="p-0">
              <FeedbackTable type="negative" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="neutral">
          <Card>
            <CardContent className="p-0">
              <FeedbackTable type="neutral" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog
        open={responseDialog.isOpen}
        onOpenChange={(open) => setResponseDialog({ isOpen: open, feedback: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Send a response to this feedback. The user will be notified.
            </DialogDescription>
          </DialogHeader>
          {responseDialog.feedback && (
            <div className="space-y-4">
              <div className="flex-col gap-2">
                <p className="">Original Feedback</p>
                <p className="t">{responseDialog.feedback.feedback_text}</p>
              </div>
              <Textarea
                placeholder="Type your response here..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResponseDialog({ isOpen: false, feedback: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSubmitResponse();
              }}
              disabled={
                !responseText.trim() || isRespondingToFeedback || isRespondingToPublicFeedback
              }
            >
              {(isRespondingToFeedback || isRespondingToPublicFeedback) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <Send className="w-4 h-4 mr-1" />
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
