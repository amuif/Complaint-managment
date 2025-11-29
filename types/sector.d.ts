import { Subcities } from "./subcities";

export interface Sector {
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
  subcity_id: string | null;
  subcity: Subcities | null;
  profile_picture: string;
  created_at: string;
}
