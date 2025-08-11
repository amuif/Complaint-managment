'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '../priority-badge';
import { StatusBadge } from '../status-badge';
import { Complaint } from '@/types/complaint';

const formSchema = z.object({
  priority: z.enum(['urgent', 'high', 'normal', 'low']),
  status: z.enum(['open', 'in-progress', 'resolved']),
  admin_notes: z.string().optional(),
  resolution_summary: z.string().optional(),
  follow_up_required: z.boolean().optional(),
  follow_up_date: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to map API status to UI status
const mapApiStatusToUi = (apiStatus?: string | null): FormValues['status'] => {
  switch (apiStatus) {
    case 'submitted':
    case 'under_review':
      return 'open';
    case 'investigating':
      return 'in-progress';
    case 'resolved':
    case 'closed':
      return 'resolved';
    default:
      return 'open';
  }
};

// Helper function to map UI status back to API status
const mapUiStatusToApi = (uiStatus: FormValues['status']): Complaint['status'] => {
  switch (uiStatus) {
    case 'open':
      return 'under_review';
    case 'in-progress':
      return 'investigating';
    case 'resolved':
      return 'resolved';
    default:
      return 'under_review';
  }
};

export function ComplaintEditForm({
  complaint,
  onSave,
  onCancel,
}: {
  complaint: Complaint;
  onSave: (data: Partial<Complaint>) => void;
  onCancel: () => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: complaint.priority || 'normal',
      status: mapApiStatusToUi(complaint.status) || 'open',
      admin_notes: complaint.admin_notes || '',
      resolution_summary: complaint.resolution_summary || '',
      follow_up_required: complaint.follow_up_required || false,
      follow_up_date: complaint.follow_up_date || '',
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave({
      ...values,
      status: mapUiStatusToApi(values.status),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'normal'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(['urgent', 'high', 'normal', 'low'] as const).map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        <PriorityBadge priority={priority} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || 'open'}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(['open', 'in-progress', 'resolved'] as const).map((status) => (
                      <SelectItem key={status} value={status}>
                        <StatusBadge status={status} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="admin_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Internal notes about this complaint..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('status') === 'resolved' && (
          <FormField
            control={form.control}
            name="resolution_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution Summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="How was this complaint resolved?"
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
