'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Building,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
} from 'lucide-react';
import { Complaint } from '@/types/complaint';

interface ComplaintDetailsDialogProps {
  openDetails: {
    isOpen: boolean;
    complaint: Complaint | null;
  };
  setOpenDetails: (state: { isOpen: boolean; complaint: any | null }) => void;
  formatDate: (date: string) => string;
}

const API_VOICE_URL = process.env.NEXT_PUBLIC_AUDIO_URL || 'https://backend.torobingo.com';
export function ComplaintDetailsDialog({
  openDetails,
  setOpenDetails,
  formatDate,
}: ComplaintDetailsDialogProps) {
  const complaint = openDetails.complaint;

  console.log(complaint);
  if (!complaint) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-gray-100 800';
      default:
        return 'bg-gray-100 800';
    }
  };

  return (
    <Dialog
      open={openDetails.isOpen}
      onOpenChange={(open) => setOpenDetails({ isOpen: open, complaint: null })}
    >
      <DialogContent className="max-w-[80%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Complaint Details - #{complaint.phone_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(complaint.status)}>
              {complaint.status?.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={getPriorityColor(complaint.priority)}>
              {complaint.priority?.toUpperCase()} PRIORITY
            </Badge>
            <Badge variant="outline">
              {complaint.complaint_type?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Complainant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 500" />
                  <span className="font-medium">Name:</span>
                  <span>{complaint.complaint_name || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 500" />
                  <span className="font-medium">Phone:</span>
                  <span>{complaint.phone_number || 'Not provided'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 500" />
                  <span className="font-medium">Location:</span>
                  <span>
                    Woreda {complaint.woreda || 'Subcity Not specified'},{' '}
                    {complaint.sub_city?.name_en + ' subcity' || 'Subcity Not specified'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Description</CardTitle>
            </CardHeader>
            <CardContent>
              {complaint.voice_note ? (
                <div className="space-y-2">
                  <p className="text-sm 600">Voice Note:</p>
                  <audio controls className="w-full">
                    <source src={`${API_VOICE_URL}/${complaint.voice_note}`} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ) : (
                <p className="">{complaint.complaint_description}</p>
              )}
            </CardContent>
          </Card>

          {/* Department Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {complaint.department?.name_en}
                </div>
                <div></div>
                <div>
                  <span className="font-medium">Appointed person:</span>{' '}
                  {complaint.department?.appointed_person_en}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Director & Sector</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium">Director:</span>
                  <p className="text-sm ">{complaint.division?.name_en}</p>
                </div>
                <div>
                  <span className="font-medium">Sector:</span>
                  <p className="text-sm ">{complaint.sector?.name_en}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Employee */}
          {complaint.employee && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Assigned Employee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>
                      {complaint.employee.first_name_en} {complaint.employee.middle_name_en}{' '}
                      {complaint.employee.last_name_en}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Position:</span>
                    <p>{complaint.employee.position_en}</p>
                  </div>
                  <div>
                    <span className="font-medium">Employee ID:</span>
                    <p>{complaint.employee.employee_id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Office:</span>
                    <p>{complaint.employee.office_number}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{complaint.employee.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p>{complaint.employee.phone}</p>
                  </div>
                </div>
                {complaint.employee.specializations && (
                  <div>
                    <span className="font-medium">Specializations:</span>
                    <p className="text-sm ">{complaint.employee.specializations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Office Information */}
          {complaint.office && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Office Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Office:</span> {complaint.office.name_en}
                  </div>
                  <div>
                    <span className="font-medium">Office Number:</span>{' '}
                    {complaint.office.office_number}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {complaint.office.location}
                  </div>
                  <div>
                    <span className="font-medium">Floor:</span> {complaint.office.floor}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="text-sm ">{complaint.office.description}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {complaint.response ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                Response & Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Admin Response:</span>
                <p className="text-sm 600 mt-1">
                  {complaint.response || "The admin hasn't replied to this complaint yet"}
                </p>
              </div>

              {complaint.resolution_summary && (
                <div>
                  <span className="font-medium">Resolution Summary:</span>
                  <p className="text-sm 600 mt-1">{complaint.resolution_summary}</p>
                </div>
              )}

              {complaint.admin_notes && (
                <div>
                  <span className="font-medium">Admin Notes:</span>
                  <p className="text-sm 600 mt-1">{complaint.admin_notes}</p>
                </div>
              )}

              {complaint.citizen_satisfaction_rating && (
                <div>
                  <span className="font-medium">Satisfaction Rating:</span>
                  <p className="text-sm 600 mt-1">{complaint.citizen_satisfaction_rating}/5</p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm 500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Follow-up Required:</span>
                  <span>{complaint.follow_up_required ? 'Yes' : 'No'}</span>
                </div>
                {complaint.follow_up_date && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Follow-up Date:</span>
                    <span>{formatDate(complaint.follow_up_date)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Created:</span>
                  <p className="">{formatDate(complaint.created_at)}</p>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <p className="">{formatDate(complaint.updated_at)}</p>
                </div>
                {complaint.resolved_at && (
                  <div>
                    <span className="font-medium">Resolved:</span>
                    <p className="">{formatDate(complaint.resolved_at)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
