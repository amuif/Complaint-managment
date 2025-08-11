'use client';

import { MessageSquare, FileText, UserCog, Building2, Settings, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/language-provider';
import { useComplaints } from '@/hooks/use-complaints';
import { useFeedback } from '@/hooks/use-feedback';
import { useRatings } from '@/hooks/use-ratings';
import { format, parseISO } from 'date-fns';

export function RecentActivitySuperAdmin() {
  const { t } = useLanguage();

  const { complaints, publicComplaints, isLoading: complaintsLoading } = useComplaints();
  const { feedback, publicFeedback, isLoading: feedbackLoading } = useFeedback();
  const { ratings, publicRatings, isLoading: ratingsLoading } = useRatings();

  // Combine all activities and sort by date
  const activities = [];

  // Add recent complaints
  if (complaints) {
    complaints.slice(0, 3).forEach((complaint) => {
      activities.push({
        id: `complaint-${complaint.id}`,
        type: 'complaint',
        title: `New Complaint #${complaint.tracking_code}`,
        description: `Department: ${complaint.department} • Section: ${complaint.section}`,
        time: format(parseISO(complaint.created_at), 'MMM dd, HH:mm'),
        status: complaint.status || 'Open',
        icon: MessageSquare,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-500/10',
        timestamp: new Date(complaint.created_at),
      });
    });
  }

  // Add recent public complaints
  if (publicComplaints) {
    publicComplaints.slice(0, 2).forEach((complaint) => {
      activities.push({
        id: `public-complaint-${complaint.id}`,
        type: 'complaint',
        title: `Public Complaint #${complaint.tracking_code}`,
        description: `Department: ${complaint.department} • Section: ${complaint.section}`,
        time: format(parseISO(complaint.created_at), 'MMM dd, HH:mm'),
        status: complaint.status || 'Open',
        icon: MessageSquare,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-500/10',
        timestamp: new Date(complaint.created_at),
      });
    });
  }

  // Add recent feedback
  if (feedback) {
    feedback.slice(0, 2).forEach((fb) => {
      activities.push({
        id: `feedback-${fb.id}`,
        type: 'feedback',
        title: 'New Feedback Received',
        description: `Section: ${fb.section} • Rating: ${fb.rating || 'N/A'}/5`,
        time: format(parseISO(fb.created_at), 'MMM dd, HH:mm'),
        status: 'New',
        icon: FileText,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-500/10',
        timestamp: new Date(fb.created_at),
      });
    });
  }

  // Add recent ratings
  if (ratings) {
    ratings.slice(0, 2).forEach((rating) => {
      const avgRating = ((rating.courtesy + rating.timeliness + rating.knowledge) / 3).toFixed(1);
      activities.push({
        id: `rating-${rating.id}`,
        type: 'rating',
        title: 'New Service Rating',
        description: `Employee: ${
          rating.Employee?.employee_name || 'Unknown'
        } • Avg: ${avgRating}/5`,
        time: format(parseISO(rating.created_at), 'MMM dd, HH:mm'),
        status:
          parseFloat(avgRating) >= 4 ? 'Excellent' : parseFloat(avgRating) >= 3 ? 'Good' : 'Poor',
        icon: Star,
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-500/10',
        timestamp: new Date(rating.created_at),
      });
    });
  }

  // Sort by timestamp (newest first) and take top 5
  const sortedActivities = activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'urgent':
      case 'critical':
      case 'poor':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'resolved':
      case 'excellent':
      case 'new':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
      case 'open':
      case 'good':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (complaintsLoading || feedbackLoading || ratingsLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg p-2">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sortedActivities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent activity found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
          >
            <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="truncate text-sm font-medium">{activity.title}</p>
              <Badge variant="outline" className={`ml-2 ${getStatusColor(activity.status)}`}>
                {activity.status}
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">{activity.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
