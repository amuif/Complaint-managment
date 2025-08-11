'use client';
import { MessageSquare, FileText, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/language-provider';

export function RecentActivity() {
  const { t } = useLanguage();

  const activities = [
    {
      id: 'C1006',
      type: 'complaint',
      title: t('newComplaint', { id: '#C1006' }),
      description: `${t('submittedBy')}: Alemayehu Tadesse • ${t('assignedTo')}: Abebe Kebede`,
      time: t('hoursAgo', { hours: 2 }),
      status: t('open'),
      icon: MessageSquare,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
    },
    {
      id: 'F1023',
      type: 'feedback',
      title: t('newFeedbackReceived'),
      description: `${t('service')}: ${t('idCardIssuance')} • ${t('rating')}: 5/5`,
      time: t('hoursAgo', { hours: 3 }),
      status: t('positive'),
      icon: Star,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
    },
    {
      id: 'S1045',
      type: 'service',
      title: t('serviceStandardUpdated'),
      description: `${t('service')}: ${t('businessLicenseRegistration')} • ${t('newTime')}: 3 ${t('days')}`,
      time: t('hoursAgo', { hours: 5 }),
      status: t('updated'),
      icon: FileText,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
    },
    {
      id: 'C1005',
      type: 'complaint',
      title: t('complaintResolved', { id: '#C1005' }),
      description: `${t('resolvedBy')}: Dawit Mengistu • ${t('customer')}: Rahel Tesfaye`,
      time: t('hoursAgo', { hours: 8 }),
      status: t('resolved'),
      icon: MessageSquare,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-500/10',
    },
    {
      id: 'F1022',
      type: 'feedback',
      title: t('newFeedbackReceived'),
      description: `${t('service')}: ${t('propertyTaxPayment')} • ${t('rating')}: 3/5`,
      time: t('hoursAgo', { hours: 10 }),
      status: t('neutral'),
      icon: Star,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-500/10',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case t('open'):
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case t('resolved'):
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case t('positive'):
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case t('neutral'):
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case t('updated'):
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
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
