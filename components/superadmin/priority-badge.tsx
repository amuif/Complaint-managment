import { Badge } from '@/components/ui/badge';

export type Priority = 'urgent' | 'high' | 'normal' | 'medium' | 'low';

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const normalizedPriority = priority === 'medium' ? 'normal' : priority;

  const getVariantAndColor = (priority: Priority) => {
    switch (normalizedPriority) {
      case 'urgent':
        return {
          variant: 'destructive' as const,
          className:
            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
        };
      case 'high':
        return {
          variant: 'default' as const,
          className:
            'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
        };
      case 'normal':
        return {
          variant: 'outline' as const,
          className:
            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        };
      case 'low':
        return {
          variant: 'secondary' as const,
          className:
            'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
        };
      default:
        return {
          variant: 'outline' as const,
          className:
            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
        };
    }
  };

  const { variant, className } = getVariantAndColor(normalizedPriority);

  const labelMap = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  };

  return (
    <Badge variant={variant} className={className}>
      {labelMap[normalizedPriority]}
    </Badge>
  );
}
