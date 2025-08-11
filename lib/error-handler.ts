import { toast } from '@/hooks/use-toast';

export function handleApiSuccess(message: string, title?: string) {
  toast({
    title: title || 'Success',
    description: message,
    variant: 'default',
  });
}
export function handleApiError(error: any, defaultMessage?: string) {
  toast({
    title: 'Error',
    description: error.message,
    variant: 'destructive',
  });
  return;
}
