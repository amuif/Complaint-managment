import { Department } from './department';
import { Division } from './division';
import { Sector } from './sector';
import { Subcities } from './subcities';

export interface Employee {
  id: number;
  employee_id: string;

  first_name_en: string;
  first_name_am: string;
  first_name_af: string;

  middle_name_en: string;
  middle_name_am: string;
  middle_name_af: string;

  last_name_en: string;
  last_name_am: string;
  last_name_af: string;

  office_id: number | null;
  office_number: string | null;
  floor_number: number | null;

  position_en: string;
  position_am: string;
  position_af: string;

  sector_id: number | null;
  division_id: number | null;
  team_id: number | null;
  department_id: number | null;

  department: Department;
  sector: Sector;
  team: Department;
  division?: Division;
  section: string;
  city: string | null;
  subcity: Subcities;
  works_in_head_office: boolean;

  email: string | null;
  phone: string | null;
  profile_picture: File | null;

  bio_en: string | null;
  bio_am: string | null;
  bio_af: string | null;

  specializations: string | null;
  years_of_service: number;

  education_level: string | null;
  is_active: boolean;

  hire_date: string | null; // ISO date string (e.g., "2025-08-07")

  created_at: string; // ISO timestamp string
  updated_at: string; // ISO timestamp string
}
export type EmployeeFiltersTypes = {
  city?: string;
  subcity?: string;
  department?: string;
};
