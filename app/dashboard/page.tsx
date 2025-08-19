'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/components/language-provider';
import { useStatistics } from '@/hooks/use-statistics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  MessageSquare,
  FileText,
  Star,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  Loader2,
} from 'lucide-react';
import { adminRoles } from '@/types/user';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { statistics, isLoading, isError, error } = useStatistics();
  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    console.log(statistics);
  }, [statistics]);

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Loading Dashboard...</h1>
          <p className="text-muted-foreground">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">
            {error?.message || 'Failed to load dashboard data'}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {getWelcomeMessage()}, {user?.username || 'Admin'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('welcomeBack')} Here's what's happening in your office today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="sleek-card border-none bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalEmployees')}</CardTitle>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {statistics?.totalEmployees || 0}
            </div>
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              Active employees
            </div>
          </CardContent>
        </Card>

        <Card className="sleek-card border-none bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalComplaints')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {statistics?.totalComplaints || 0}
            </div>
            <div className="flex items-center text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {statistics?.pendingComplaints || 0} pending
            </div>
          </CardContent>
        </Card>

        <Card className="sleek-card border-none bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('averageRating')}</CardTitle>
            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {statistics?.averageRating || 0}/5
            </div>
            <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
              <Star className="h-3 w-3 mr-1" />
              {statistics?.totalRatings || 0} total ratings
            </div>
          </CardContent>
        </Card>

        <Card className="sleek-card border-none bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalFeedback')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {statistics?.totalFeedback || 0}
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <FileText className="h-3 w-3 mr-1" />
              Customer feedback
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics for your department this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complaint Resolution Rate</span>
                <span className="text-sm text-muted-foreground">
                  {(statistics?.totalComplaints || 0) > 0
                    ? Math.round(
                        ((statistics?.resolvedComplaints || 0) /
                          (statistics?.totalComplaints || 1)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  (statistics?.totalComplaints || 0) > 0
                    ? ((statistics?.resolvedComplaints || 0) / (statistics?.totalComplaints || 1)) *
                      100
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm text-muted-foreground">
                  {statistics?.averageRating
                    ? Math.round(parseFloat(statistics.averageRating.toString()) * 20)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  statistics?.averageRating
                    ? parseFloat(statistics.averageRating.toString()) * 20
                    : 0
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Employee Utilization</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              View New Complaints
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Review Feedback
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Employees
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New complaint received</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Complaint resolved</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Feedback submitted</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important notifications and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(statistics?.pendingComplaints || 0) > 0 && (
                <div className="flex items-center space-x-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pending Complaints</p>
                    <p className="text-xs text-muted-foreground">
                      {statistics?.pendingComplaints || 0} complaints need attention
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Weekly Report Due</p>
                  <p className="text-xs text-muted-foreground">
                    Submit your weekly report by Friday
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
