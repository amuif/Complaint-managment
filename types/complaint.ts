import { Department } from './department';
import { Division } from './division';
import { Employee } from './employee';
import { Office } from './office';
import { Sector } from './sector';
import { Subcities } from './subcities';

export interface Complaint {
  id: string;
  type?: 'voice' | 'text' | null;
  date?: string | null;
  region?: string | null;
  complaint_name?: string | null;
  phone_number: string;
  email?: string | null;
  complaint_source: string;
  title_en?: string | null;
  title_am?: string | null;
  title_af?: string | null;

  description_en?: string | null;
  description_am?: string | null;
  description_af?: string | null;

  response?: string | null;

  employee_id?: number | null;

  complaint_description?: string | null;

  desired_action_en?: string | null;
  desired_action_am?: string | null;
  desired_action_af?: string | null;
  employee?: Employee;
  division?: Division | null;
  department?: Department | null;
  sector: Sector;
  office?: Office | null;
  sub_city: Subcities;
  woreda?: string | null;

  service_type?: string | null;

  complaint_type?: 'service_quality' | 'staff_behavior' | 'facility' | 'other' | null;

  voice_note?: string | null;
  attachment?: Attachment;

  status: 'submitted' | 'under review' | 'investigating' | 'resolved' | 'closed';

  priority: 'low' | 'normal' | 'high' | 'urgent';

  assigned_admin?: number | null;

  admin_notes?: string | null;

  resolution_summary?: string | null;

  citizen_satisfaction_rating?: number | null;

  follow_up_required?: boolean | null;

  follow_up_date?: string | null;

  resolved_at?: string | null;

  created_at: string;

  updated_at: string;

  timeline?: {
    date: string;
    action: string;
    by: string;
  }[];
}
export interface Attachment {
  file_path: string;
  file_type: string;
  id: string;
  uploaded_at: string;
}
