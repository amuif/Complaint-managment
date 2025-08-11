import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComplaintEditForm } from './complaint-edit-form';
import { Complaint } from '@/types/complaint';

interface ComplaintEditDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedComplaint: Complaint) => void;
}

export function ComplaintEditDialog({
  complaint,
  open,
  onOpenChange,
  onSave,
}: ComplaintEditDialogProps) {
  if (!complaint) return null;

  const handleSave = (updatedData: Partial<Complaint>) => {
    const updatedComplaint = {
      ...complaint,
      ...updatedData,
      updated_at: new Date().toISOString(), // Auto-update timestamp
    };
    onSave(updatedComplaint);
  };

  const getComplaintTypeDisplay = () => {
    if (!complaint.complaint_type) return 'General Complaint';
    switch (complaint.complaint_type) {
      case 'service_quality':
        return 'Service Quality';
      case 'staff_behavior':
        return 'Staff Behavior';
      case 'facility':
        return 'Facility Issue';
      case 'other':
        return 'Other';
      default:
        return complaint.complaint_type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Complaint #{complaint.id}
          </DialogTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>Type: {getComplaintTypeDisplay()}</span>
            {complaint.department && <span>• Department: {complaint.department}</span>}
            {complaint.subcity && <span>• Location: {complaint.subcity}</span>}
          </div>
        </DialogHeader>
        <ComplaintEditForm
          complaint={complaint}
          onSave={handleSave}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
