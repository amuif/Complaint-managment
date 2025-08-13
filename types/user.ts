import { Department } from './department';
import { Division } from './division';
import { Sector } from './sector';
import { Subcities } from './subcities';

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  role: adminRoles;
  first_name: string;
  last_name: string;
  city: string | null;
  subcity_id: number | null;
  department_id: number | null;
  sector_id: number | null;
  division_id: number | null;
  phone: string | null;
  profile_picture: string | null;
  is_active: boolean;
  last_login: string | null;
  failed_login_attempts: number;
  account_locked_until: string | null;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  sector: Sector;
  department: Department | null;
  division: Division | null;
  subcity: Subcities | null;
}
export enum adminRoles {
  SuperAdmin,
  SuperAdminSupporter,
  Admin,
  Editor,
  Viewer,
}
