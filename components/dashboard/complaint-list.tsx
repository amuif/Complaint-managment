'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, MoreHorizontal, Send } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { useComplaints } from '@/hooks/use-complaints';
import { Skeleton } from '@/components/ui/skeleton';
import { Complaint } from '@/types/complaint';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleApiSuccess } from '@/lib/error-handler';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { differenceInDays } from 'date-fns';

import { ComplaintDetailsDialog } from '../complaint-details-dialog';
interface ComplaintListProps {
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
}
const statusOptions = [
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under review' },
  { label: 'Investigating', value: 'investigating' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
  { label: 'Opened', value: 'Opened' },
] as const;

type ComplaintStatus = (typeof statusOptions)[number]['value'];

export function ComplaintList({ searchQuery, statusFilter, priorityFilter }: ComplaintListProps) {
  const { t } = useLanguage();
  const {
    publicComplaints,
    isLoading,
    respondToComplaint,
    respondToPublicComplaint,
    isRespondingToComplaint,
    isRespondingToPublicComplaint,
    editPublicComplaintStatus,
  } = useComplaints();
  const [activeMenuComplaint, setActiveMenuComplaint] = useState<number | null>(null);
  const [detailsComplaintId, setDetailsComplaintId] = useState<number | null>(null);
  const [editStatusComplaintId, setEditStatusComplaintId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Open');
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [sorting, setSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({
    column: 'created_at',
    direction: 'desc',
  });
  const [responseDialog, setResponseDialog] = useState<{
    isOpen: boolean;
    complaint: Complaint | null;
  }>({ isOpen: false, complaint: null });
  const [responseText, setResponseText] = useState('');
  const [openDetails, setOpenDetails] = useState<{
    isOpen: boolean;
    complaint: Complaint | null;
  }>({ isOpen: false, complaint: null });
  const [opedEditStatus, setOpenEditStatus] = useState<{
    isOpen: boolean;
    complaint: Complaint | null;
  }>({ isOpen: false, complaint: null });
  const handleSubmitResponse = () => {
    if (!responseDialog.complaint || !responseText.trim()) return;
    try {
      const isPublicComplaint = responseDialog.complaint.complaint_source === 'public_complaint';

      if (isPublicComplaint) {
        respondToPublicComplaint({
          id: responseDialog.complaint.id,
          response: responseText.trim(),
          status: status || 'resolved',
        });
      } else {
        respondToComplaint({
          id: responseDialog.complaint.id,
          response: responseText.trim(),
          status: status || 'resolved',
        });
      }
    } catch (error) {
      console.error('Error at responind to complaint', error);
    }

    setResponseDialog({ isOpen: false, complaint: null });
    setResponseText('');
  };

  useEffect(() => {
    console.log(publicComplaints);
  }, [publicComplaints]);
  const handleRespond = (complaint: Complaint) => {
    setResponseDialog({ isOpen: true, complaint });
    setResponseText('');
  };
  const handleDetials = (complaint: Complaint) => {
    setOpenDetails({ isOpen: true, complaint });
    setResponseText('');
  };
  const handleEditStatus = (complaint: Complaint) => {
    setOpenEditStatus({ isOpen: true, complaint });
    setResponseText('');
  };
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  // Filtering logic
  const filteredComplaints = publicComplaints.filter((complaint: Complaint) => {
    const matchesSearch =
      (complaint.description_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((complaint.employee?.first_name_en || '') + ' ' + (complaint.employee?.last_name_en || ''))
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });
  const displayedComplaints = filteredComplaints.sort((a, b) => {
    const aValue = a[sorting.column as keyof typeof a] || '';
    const bValue = b[sorting.column as keyof typeof b] || '';

    if (sorting.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const isOverdue = (complaint: Complaint) => {
    if (complaint.response) return false;
    const createdAt = parseISO(complaint.created_at || complaint.updated_at);
    return differenceInDays(new Date(), createdAt) > 3;
  };
  // Copy tracking code
  const handleCopyTrackingCode = (trackingCode: string) => {
    if (!trackingCode) return;
    navigator.clipboard.writeText(trackingCode).then(() => {
      alert('Tracking code copied to clipboard!');
    });
  };

  const handleSelectComplaint = (complaintId: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(complaintId) ? prev.filter((id) => id !== complaintId) : [...prev, complaintId]
    );
  };
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'open':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedComplaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No complaints found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            displayedComplaints.map((complaint) => (
              <TableRow
                key={complaint.id}
                className={
                  selectedComplaints.includes(complaint.id.toString()) ? 'bg-muted/50' : ''
                }
              >
                <TableCell className="font-medium">#{complaint.phone_number}</TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="truncate" title="Description">
                    {complaint.complaint_description}
                  </div>
                </TableCell>
                <TableCell>{complaint.phone_number}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {complaint?.department?.name_en || 'Unassigned'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {complaint.sub_city?.name_en || 'subcity not assigned'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(complaint.status!)}>
                      <span className="flex items-center gap-1">{complaint.status}</span>
                    </Badge>
                    {isOverdue(complaint) && (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Overdue
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(complaint.created_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(complaint.phone_number);
                          handleApiSuccess('Tracking code copied successfully');
                        }}
                      >
                        Copy tracking code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleRespond(complaint)}>
                        Respond
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDetials(complaint)}>
                        View details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog
        open={responseDialog.isOpen}
        onOpenChange={(open) => setResponseDialog({ isOpen: open, complaint: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Complaint</DialogTitle>
            <DialogDescription>
              Send a response to this complaint. The customer will be notified.
            </DialogDescription>
          </DialogHeader>
          {responseDialog.complaint && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">
                  Complaint #{responseDialog.complaint.phone_number}
                </p>
                <div className="flex flex-col py-2">
                  <p className="text-base">Description</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 truncate">
                    {responseDialog.complaint.complaint_description}
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="Type your response here..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResponseDialog({ isOpen: false, complaint: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitResponse}
              disabled={
                !responseText.trim() || isRespondingToComplaint || isRespondingToPublicComplaint
              }
            >
              {(isRespondingToComplaint || isRespondingToPublicComplaint) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <Send className="w-4 h-4 mr-1" />
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {openDetails.complaint && (
        <ComplaintDetailsDialog
          openDetails={openDetails}
          setOpenDetails={setOpenDetails}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}
