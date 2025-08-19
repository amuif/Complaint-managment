import { z } from 'zod';

export const userCreateSchema = z.object({
  profile_picture: z.instanceof(File).optional().or(z.string().optional()),

  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),

  email: z.string().email('Invalid email').optional(),

  phone: z.string().min(1, 'Phone is required'),
  city: z.string().min(1, 'City is required'),

  role: z.string().min(1, 'Role is required'),
  is_active: z.boolean(),

  subcity_id: z.string().min(1, 'Subcity is required'),
  sector_id: z.string().min(1, 'Sector is required'),

  division_id: z.string().optional(),
  department_id: z.string().optional(),

  password: z.string().min(6, 'Password must be at least 6 characters'),
  failed_login_attempts: z.string().default('0'),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
