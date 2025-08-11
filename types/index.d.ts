export type Employee = {
  type: string;
  id: number;
  employee_id: string;
  first_name_en: string | null;
  first_name_am: string | null;
  first_name_af: string | null;
  middle_name_en: string | null;
  middle_name_am: string | null;
  middle_name_af: string | null;
  last_name_en: string | null;
  last_name_am: string | null;
  last_name_af: string | null;
  office_id: number | null;
  office_number: string | null;
  floor_number: number | null;
  position_en: string | null;
  position_am: string | null;
  position_af: string | null;
  department_id: number | null;
  department_en: string | null;
  department_am: string | null;
  department_af: string | null;
  section: string;
  city: string | null;
  subcity: string | null;
  email: string | null;
  phone: string | null;
  profile_picture: string | null;
  bio_en: string | null;
  bio_am: string | null;
  bio_af: string | null;
  specializations: string | null;
  years_of_service: number;
  education_level: string | null;
  is_active: boolean;
  hire_date: string | null;
  created_at: string;
  updated_at: string;
};

export interface Feedback {
  id: string;
  type: string;
  title: string;
  phone_number: string;
  section: string;
  department: string | null;
  employee_id: number | null;
  feedback_text: string;
  status: string;
  rating: number | null;
  created_at: string;
  employee?: Employee;
  type: string;
  feedback_source: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  detailedDescription: string;
  requirements: string[];
  standardTime: string;
  fee: string;
  department: string;
  contactPerson: number;
  location: string;
  availability: string;
  steps: string[];
  status: string;
  popularity: number;
}
interface ApiResponse {
  success: boolean;
  data: Complaint[];
}

export interface User {
  id: number;
  username: string;
  role: 'SuperAdmin' | 'SubCityAdmin' | 'Admin';
  city: string | null;
  subcity: string | null;
  section: string | null; // Keep for backward compatibility
  department: string | null;
  profile_picture: string | null;
}

export interface AuthResponse {
  message: string;
  token: string;
  admin: User;
}

export interface Statistics {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  totalEmployees: number;
  totalAdmins: number;
  totalRatings: number;
  totalFeedback: number;
  averageRating: number;
  employees: number;
  services: number;
  complaints: number;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface TrendData {
  date: string;
  count: number;
  [key: string]: any;
}
export interface Office {
  id: number;
  name: string;
  department_id: number;
  floor_number: number;
  office_number: string;
}
