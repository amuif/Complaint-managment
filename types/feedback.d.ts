import { Department } from './department';
import { Division } from './division';
import { Employee } from './employee';
import { Sector } from './sector';
import { Subcities } from './subcities';

export interface Feedback {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  sector_id: string;
  sector: Sector;
  department_id: string;
  department: Department;
  division_id: string;
  division: Division;
  team_id: string;
  employee_id: string;
  employee: Employee;
  subject: string;
  feedback_type: 'suggestion' | 'concern' | 'compliment';
  feedback_text: string;
  subcity_id: string;
  subcity: Subcities;
  service_expreienced: string;
  overall_satisfaction: string;
  would_recommend: string;
  is_anonymus: string;
  admin_response: string;
  response_date: string;
  status: 'new' | 'reviewed' | 'responded' | 'archived';
  created_at: string;
  updated_at: string;
  feedback_source: string;
}
