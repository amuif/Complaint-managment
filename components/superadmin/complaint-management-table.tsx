'use client';

import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Send,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/language-provider';
import { useComplaints } from '@/hooks/use-complaints';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { handleApiSuccess } from '@/lib/error-handler';
import { ComplaintDetailsDialog } from '../complaint-details-dialog';
import { Complaint } from '@/types/complaint';

import { differenceInDays } from 'date-fns';

interface ComplaintManagementTableProps {
  searchQuery: string;
  regionFilter: string;
  statusFilter: string;
  onViewComplaint: (complaint: Complaint) => void;
  onEditComplaint: (complaint: Complaint) => void;
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

export function ComplaintManagementTable({
  searchQuery,
  regionFilter,
  statusFilter,
}: ComplaintManagementTableProps) {
  const [status, setStatus] = useState<ComplaintStatus>('submitted');
  const { t } = useLanguage();
  const [sorting, setSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({
    column: 'created_at',
    direction: 'desc',
  });
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
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
  const {
    complaints,
    isLoading,
    isError,
    error,
    respondToComplaint,
    respondToPublicComplaint,
    isRespondingToComplaint,
    isRespondingToPublicComplaint,
    editPublicComplaintStatus,
  } = useComplaints();
  useEffect(() => {
    console.log(complaints);
  }, [complaints]);
  useEffect(() => {
    if (opedEditStatus?.complaint?.status) {
      setStatus(opedEditStatus.complaint.status);
    }
  }, [opedEditStatus]);

  const isOverdue = (complaint: Complaint) => {
    if (complaint.response) return false;
    const createdAt = parseISO(complaint.created_at || complaint.updated_at);
    return differenceInDays(new Date(), createdAt) > 3;
  };
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      !searchQuery ||
      complaint.complaint_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.phone_number?.includes(searchQuery) ||
      complaint.department?.name_en.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      complaint.status?.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === 'open' && complaint.status?.toLowerCase() === 'pending') ||
      (statusFilter === 'in-progress' && complaint.status?.toLowerCase() === 'in progress');

    // For region/priority filters, we'll use section/department as approximation
    const matchesRegion =
      regionFilter === 'all' ||
      complaint.sub_city?.name_en.toLowerCase().includes(regionFilter.toLowerCase()) ||
      complaint.department?.name_en?.toLowerCase().includes(regionFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesRegion;
  });

  // Sort complaints
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const aValue = a[sorting.column as keyof typeof a] || '';
    const bValue = b[sorting.column as keyof typeof b] || '';

    if (sorting.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column: string) => {
    setSorting((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleSelectAll = () => {
    if (selectedComplaints.length === sortedComplaints.length) {
      setSelectedComplaints([]);
    } else {
      setSelectedComplaints(sortedComplaints.map((c) => c.id.toString()));
    }
  };

  const handleSelectComplaint = (complaintId: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(complaintId) ? prev.filter((id) => id !== complaintId) : [...prev, complaintId]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
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

  const handleChangeInStatus = () => {
    if (!opedEditStatus.complaint) return;
    editPublicComplaintStatus({
      id: opedEditStatus.complaint.id,
      status: status,
      complaint_source: opedEditStatus.complaint.complaint_source,
    });
    setStatus(status);
  };
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading complaints...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error loading complaints: {error?.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    sortedComplaints.length > 0 &&
                    selectedComplaints.length === sortedComplaints.length
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Number</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('description')}
                  className="h-8 px-2 lg:px-3"
                >
                  Description
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('status')}
                  className="h-8 px-2 lg:px-3"
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('created_at')}
                  className="h-8 px-2 lg:px-3"
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No complaints found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              sortedComplaints.map((complaint) => (
                <TableRow
                  key={complaint.id}
                  className={
                    selectedComplaints.includes(complaint.id.toString()) ? 'bg-muted/50' : ''
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedComplaints.includes(complaint.id.toString())}
                      onCheckedChange={() => handleSelectComplaint(complaint.id.toString())}
                    />
                  </TableCell>
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
                        {complaint.status}
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
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditStatus(complaint);
                            if (opedEditStatus.complaint?.status) {
                              setStatus(
                                opedEditStatus.complaint.status ?? ('submitted' as ComplaintStatus)
                              );
                            }
                          }}
                        >
                          Edit status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}

      {openDetails.complaint && (
        <ComplaintDetailsDialog
          openDetails={openDetails}
          setOpenDetails={setOpenDetails}
          formatDate={formatDate}
        />
      )}

      {/* Status Dialog */}
      <Dialog
        open={opedEditStatus.isOpen}
        onOpenChange={(open) => setOpenEditStatus({ isOpen: open, complaint: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
          </DialogHeader>
          {opedEditStatus.complaint && (
            <div className="flex justify-between items-center">
              <p>Change complaint status</p>
              <Select
                value={status}
                onValueChange={(value) => {
                  const newStatus = value as ComplaintStatus;
                  setStatus(newStatus);
                  if (opedEditStatus.complaint) {
                    editPublicComplaintStatus({
                      id: opedEditStatus.complaint.id,
                      status: newStatus,
                      complaint_source: opedEditStatus.complaint.complaint_source,
                    });
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
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
    </>
  );
}
