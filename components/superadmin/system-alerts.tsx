'use client';

import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/components/language-provider';

export function SystemAlerts() {
  const { t } = useLanguage();

  const alerts = [
    {
      type: 'error',
      title: 'System Alert',
      message:
        'Database connection issues detected in Tigray region. Technical team has been notified.',
    },
    {
      type: 'info',
      title: 'Maintenance Alert',
      message: 'Scheduled maintenance on May 15, 2025 from 2:00 AM to 4:00 AM EAT.',
    },
    {
      type: 'success',
      title: 'System Update',
      message:
        'System successfully updated to version 2.4.5 with improved performance and security features.',
    },
  ];

  const getIcon = (type: string) => {
    if (type === 'error') return <span className="text-xl mr-2">⚠️</span>;
    if (type === 'info') return <span className="text-xl mr-2">ℹ️</span>;
    if (type === 'success') return <span className="text-xl mr-2">✔️</span>;
    return null;
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="border border-muted rounded-lg px-6 py-4 flex items-start gap-3 bg-transparent"
        >
          <div className="pt-1">{getIcon(alert.type)}</div>
          <div>
            <div className="font-semibold text-base mb-1">{alert.title}</div>
            <div className="text-muted-foreground text-sm">{alert.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
