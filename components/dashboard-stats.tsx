'use client';

import { Users, FileText, MessageSquare, Star, TrendingUp, TrendingDown } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import { useStatistics } from '@/hooks/use-statistics';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardStats() {
  const { t } = useLanguage();
  const { statistics, isLoading } = useStatistics();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-3">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: t('totalEmployees'),
      value: statistics?.employees.toString() || '0',
      icon: Users,
      change: '+2.5%',
      trend: 'up',
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-500/20',
    },
    {
      title: t('activeServices'),
      value: statistics?.services.toString() || '0',
      icon: FileText,
      change: '+12%',
      trend: 'up',
      color: 'bg-green-500/10',
      iconColor: 'text-green-500',
      borderColor: 'border-green-500/20',
    },
    {
      title: t('openComplaints'),
      value: statistics?.pendingComplaints.toString() || '0',
      icon: MessageSquare,
      change: '+8.1%',
      trend: 'down',
      color: 'bg-red-500/10',
      iconColor: 'text-red-500',
      borderColor: 'border-red-500/20',
    },
    {
      title: t('averageRating'),
      value: statistics?.averageRating || '0',
      icon: Star,
      change: '+1.2%',
      trend: 'up',
      color: 'bg-amber-500/10',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`sleek-card border-none bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900 overflow-hidden transition-all duration-300 hover:scale-[1.03]`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-full ${stat.color} p-3`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <span
                className={`flex items-center text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
