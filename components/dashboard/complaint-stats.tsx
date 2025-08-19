'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { useComplaints } from '@/hooks/use-complaints';

export function ComplaintStats() {
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const { publicComplaints } = useComplaints();

  useEffect(() => {
    if (!publicComplaints || publicComplaints.length === 0) {
      setStats({ open: 0, inProgress: 0, resolved: 0, total: 0 });
      setLoading(false);
      return;
    }

    const open = publicComplaints.filter((c) => c.status === 'submitted').length;
    const inProgress = publicComplaints.filter((c) => c.status === 'investigating').length;
    const resolved = publicComplaints.filter((c) => c.status === 'resolved').length;
    const total = publicComplaints.length;

    setStats({ open, inProgress, resolved, total });
    setLoading(false);
  }, [publicComplaints]);
  const statCards = [
    {
      title: 'Open Complaints',
      value: stats.open,
      icon: AlertCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Complaints',
      value: stats.total,
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-24"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-full ${stat.bgColor} p-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
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
