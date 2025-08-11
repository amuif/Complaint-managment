'use client';

import { useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import { ComplaintItem } from '@/components/dashboard/complaint-item';
import { useLanguage } from '@/components/language-provider';
import { useComplaints } from '@/hooks/use-complaints';
import { Skeleton } from '@/components/ui/skeleton';
import { Complaint } from '@/types/complaint';

interface ComplaintListProps {
  searchQuery: string;
  statusFilter: string;
  priorityFilter: string;
}

export function ComplaintList({ searchQuery, statusFilter, priorityFilter }: ComplaintListProps) {
  const { t } = useLanguage();
  const { complaints, isLoading } = useComplaints();
  const [activeMenuComplaint, setActiveMenuComplaint] = useState<number | null>(null);
  const [detailsComplaintId, setDetailsComplaintId] = useState<number | null>(null);
  const [editStatusComplaintId, setEditStatusComplaintId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Open');

  // Filtering logic
  const filteredComplaints = complaints.filter((complaint: Complaint) => {
    const matchesSearch =
      (complaint.description_en || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((complaint.Employee?.first_name_en || '') + ' ' + (complaint.Employee?.last_name_en || ''))
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Copy tracking code
  const handleCopyTrackingCode = (trackingCode: string) => {
    if (!trackingCode) return;
    navigator.clipboard.writeText(trackingCode).then(() => {
      alert('Tracking code copied to clipboard!');
    });
  };

  // Edit status logic (should be replaced with real API call)
  const handleEditStatus = (id: number) => {
    // TODO: Replace with mutation/API call
    alert('Status updated to ' + newStatus);
    setEditStatusComplaintId(null);
    setActiveMenuComplaint(null);
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
    <>
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="flex justify-between items-center relative">
            <ComplaintItem complaint={complaint} />
            <div>
              <button
                onClick={() =>
                  setActiveMenuComplaint(activeMenuComplaint === complaint.id ? null : complaint.id)
                }
                aria-label="More options"
                className="p-1"
              >
                <MoreHorizontal className="h-6 w-6" />
              </button>
              {activeMenuComplaint === complaint.id && (
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => {
                      handleCopyTrackingCode(complaint.trackingCode || '');
                      setActiveMenuComplaint(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    aria-label="Copy tracking code"
                  >
                    {t('copyTrackingCode') || 'Copy Tracking Code'}
                  </button>
                  <button
                    onClick={() => {
                      setDetailsComplaintId(complaint.id);
                      setActiveMenuComplaint(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    aria-label="View complaint details"
                  >
                    {t('viewDetails') || 'View Details'}
                  </button>
                  <button
                    onClick={() => {
                      setNewStatus(complaint.status);
                      setEditStatusComplaintId(complaint.id);
                      setActiveMenuComplaint(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    aria-label="Edit complaint status"
                  >
                    {t('editStatus') || 'Edit Status'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mt-4 text-lg font-semibold">{t('noComplaintsFound')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('adjustFiltersComplaints')}</p>
        </div>
      )}

      {/* Details Section */}
      {detailsComplaintId && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative">
            <h3 className="text-lg font-semibold mb-2">
              {t('complaintDetails') || 'Complaint Details'}
            </h3>
            <p>
              <strong>{t('description') || 'Description'}:</strong>{' '}
              {filteredComplaints.find((c) => c.id === detailsComplaintId)?.description_en}
            </p>
            <p>
              <strong>{t('assignedTo') || 'Assigned To'}:</strong>{' '}
              {filteredComplaints.find((c) => c.id === detailsComplaintId)?.Employee?.first_name_en}{' '}
              {filteredComplaints.find((c) => c.id === detailsComplaintId)?.Employee?.last_name_en}
            </p>
            <p>
              <strong>{t('status') || 'Status'}:</strong>{' '}
              {filteredComplaints.find((c) => c.id === detailsComplaintId)?.status}
            </p>
            <button
              onClick={() => setDetailsComplaintId(null)}
              className="mt-4 text-blue-600 underline"
            >
              {t('close') || 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editStatusComplaintId && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs">
            <h4 className="font-semibold mb-2">{t('editStatus') || 'Edit Status'}</h4>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              aria-label="Select complaint status"
            >
              <option value="Open">{t('open') || 'Open'}</option>
              <option value="In Progress">{t('inProgress') || 'In Progress'}</option>
              <option value="Resolved">{t('resolved') || 'Resolved'}</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditStatus(editStatusComplaintId)}
                className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
              >
                {t('updateStatus') || 'Update Status'}
              </button>
              <button
                onClick={() => setEditStatusComplaintId(null)}
                className="bg-red-600 text-white px-4 py-2 rounded flex-1"
              >
                {t('cancel') || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
