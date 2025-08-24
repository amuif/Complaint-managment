'use client';

import { FileText, Mic, Calendar, User, MapPin, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PriorityBadge } from '../priority-badge';
import { StatusBadge } from '../status-badge';
import { Complaint } from '@/types/complaint';

interface ComplaintViewDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintViewDialog({ complaint, open, onOpenChange }: ComplaintViewDialogProps) {
  if (!complaint) return null;

  // Helper function to safely map API status to UI status
  const getUiStatus = (status?: string | null): 'open' | 'in-progress' | 'resolved' => {
    switch (status) {
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

  // Helper function to safely map API priority to UI priority
  const getUiPriority = (priority?: string | null): 'urgent' | 'high' | 'normal' | 'low' => {
    switch (priority) {
      case 'urgent':
      case 'high':
      case 'normal':
      case 'low':
        return priority;
      default:
        return 'normal';
    }
  };

  const renderVoiceComplaint = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mic className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Voice Complaint</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="whitespace-pre-line">{'No transcription available'}</p>
      </div>
      {complaint.voice_note && (
        <Button variant="outline" className="gap-2">
          <Headphones className="h-4 w-4" />
          Play Recording
        </Button>
      )}
    </div>
  );

  const renderTextComplaint = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Text Complaint</span>
      </div>
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="whitespace-pre-line">
          {complaint.complaint_description || 'No description available'}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {complaint.voice_note ? (
              <Headphones className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-green-500" />
            )}
            Complaint #{complaint.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <PriorityBadge priority={getUiPriority(complaint.priority)} />
            <StatusBadge status={getUiStatus(complaint.status)} />
          </div>

          {complaint.voice_note ? renderVoiceComplaint() : renderTextComplaint()}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Submitted By</span>
              </div>
              <p>{complaint.complaint_name || 'Anonymous'}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
              <p>{new Date(complaint.created_at).toLocaleString()}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Region</span>
              </div>
              <p>{complaint.sub_city.name_en || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
