'use client';

'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/components/language-provider';
import { useComplaints } from '@/hooks/use-complaints';
import { useToast } from '@/components/ui/use-toast';
import { Complaint } from '@/types/complaint';

interface ComplaintItemProps {
  complaint: Complaint;
}

export function ComplaintItem({ complaint }: ComplaintItemProps) {
  const { t } = useLanguage();
  const { resolveComplaint } = useComplaints();
  const { toast } = useToast();
  const [isResolving, setIsResolving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [newStatus, setNewStatus] = useState(complaint.status);

  const handleResolve = async () => {
    try {
      setIsResolving(true);
      await resolveComplaint({ id: Number(complaint.id), status: newStatus });
      toast({
        title: t('complaintResolved'),
        description: t('complaintResolvedMessage'),
      });
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{complaint.description_en}</CardTitle>
          <Badge
            variant="outline"
            className={
              complaint.status === 'resolved'
                ? 'bg-green-500/10 text-green-500'
                : complaint.status === 'under review'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-blue-500/10 text-blue-500'
            }
          >
            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {t('trackingCode')}: {complaint.phone_number}
          </span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {/* Additional details can be shown here */}
        {showDetails && (
          <div>
            <p>
              {t('employee')}: {complaint.employee?.first_name_en}{' '}
              {complaint.employee?.last_name_en}
            </p>
            <p>
              {t('phoneNumber')}: {complaint.phone_number}
            </p>

            <p>
              {t('department')}:{' '}
              {typeof complaint.department === 'string' ? complaint.department : t('unassigned')}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <div className="flex gap-2">
          {complaint.status !== 'resolved' && (
            <Button size="sm" onClick={handleResolve} disabled={isResolving}>
              {isResolving ? t('resolving') : t('markAsResolved')}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t('openMenu')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(complaint.phone_number);
                  toast({ title: t('trackingCodeCopied') });
                }}
              >
                {t('copyTrackingCode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDetails(!showDetails)}>
                {t('viewDetails')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {t('editStatus')}
                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(
                      e.target.value as
                        | 'submitted'
                        | 'under review'
                        | 'investigating'
                        | 'resolved'
                        | 'closed'
                    )
                  }
                  aria-label="Select complaint status"
                  className="ml-2 border p-1 rounded"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under review">Under Review</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
