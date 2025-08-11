export interface Office {
  id: string;
  name_en: string;
  name_af: string;
  name_am: string;
  office_number: string;

  sector_id: string;
  department_id: string;
  division_id: string;
  team_id: string;
  description: string;
  location: string;
  floor: string;
  is_active: boolean;
  phone: string;
  email: string;
  opening_hours: string;
  service_offered: string;
  created_at: string;
  updated_at: string;
}
