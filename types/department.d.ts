import { Subcities } from "./subcities.d.ts"
export interface Department {
  id: string;
  name_am: string;
  name_af: string;
  name_en: string;
  appointed_person_en: string;
  appointed_person_am: string;
  appointed_person_af: string;
  office_location_en: string;
  office_location_af: string;
  office_location_am: string;

  profile_picture: string;
  created_at: string;
  sector_id: string;
  division_id: string;
  subcity_id: string | null;
  subcity: Subcities | null;
  created_at: string;
  updated_at: string;
}
