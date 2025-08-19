import { Department } from './department';
import { Division } from './division';
import { Sector } from './sector';
import { Subcities } from './subcities';

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: adminRoles;
  first_name: string;
  last_name: string;
  city: string | null;
  subcity_id: string | null;
  department_id: string | null;
  sector_id: string | null;
  division_id: string | null;
  phone: string | null;
  profile_picture: File | null;
  is_active: boolean;
  last_login: string | null;
  failed_login_attempts?: string;
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
  SuperAdmin = 'SuperAdmin',
  SuperAdminSupporter = 'SuperAdminSupporter',
  Admin = 'Admin',
  Editor = 'Editor',
  Viewer = 'Viewer',
}
