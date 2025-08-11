import { Badge } from '@/components/ui/badge';

export type Status = 'open' | 'pending' | 'in-progress' | 'in progress' | 'resolved';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status === 'in progress' ? 'in-progress' : status;

  const getVariantAndColor = (status: Status) => {
    switch (normalizedStatus) {
      case 'open':
      case 'pending':
        return {
          variant: 'default' as const,
          className:
            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        };
      case 'in-progress':
        return {
          variant: 'secondary' as const,
          className:
            'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
        };
      case 'resolved':
        return {
          variant: 'outline' as const,
          className:
            'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
        };
      default:
        return {
          variant: 'default' as const,
          className:
            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        };
    }
  };

  const { variant, className } = getVariantAndColor(normalizedStatus);

  const labelMap = {
    open: 'Open',
    pending: 'Pending',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
  };

  return (
    <Badge variant={variant} className={className}>
      {labelMap[normalizedStatus]}
    </Badge>
  );
}
