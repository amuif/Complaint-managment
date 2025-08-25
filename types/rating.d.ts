import { Department } from './department';
import { Division } from './division';
import { Employee } from './employee';
import { Sector } from './sector';
import { Subcities } from './subcities';

export interface Rating {
  // Identification
  id: string;
  employee_id: string | null;
  service_id: string | null;
  division_id: string | null;
  department_id: string | null;

  // Personal Information
  full_name: string;
  phone_number: string;

  // Location
  sub_city?: Subcities;

  // Rating Scores
  overall_rating: number;
  courtesy: number;
  knowledge: number;
  punctuality: number;

  // Service Quality Metrics
  service_speed: string | null;
  facility_quality: string | null;
  communication_quality: string | null;
  staff_professionalism: string | null;
  wait_time_minutes: string | null;

  // Experience & Feedback
  title: string;
  description: string;
  additional_comments: string | null;
  suggestions: string | null;

  // Status Flags
  issue_resolved: boolean | null;
  would_recommend: boolean | null;
  is_verified: boolean;
  status: string;

  // Metadata
  rating_source: string;
  service_type: string;
  created_at: string;
  updated_at: string;

  // Relations
  Employee?: Employee;
  department?: Department;
  division?: Division;
  sector?: Sector;
}
