//import { Complaint } from "@/types/complaint";
import { Complaint } from '@/types/complaint';
import { QueryClient } from '@tanstack/react-query';
import { handleApiError, handleApiSuccess } from './error-handler';
import { Rating } from '@/types/rating';
import { Employee, EmployeeFiltersTypes } from '@/types/employee';
import { Sector } from '@/types/sector';
import { Division } from '@/types/division';
import { Team } from '@/types/team';
import { Department } from '@/types/department';
import { Subcities } from '@/types/subcities';
import { Feedback } from '@/types/feedback';
import { User } from '@/types/user';

// Base API configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.torobingo.com/api'; // || 'http://196.189.93.235:4000/api';

export interface Service {
  id: number;
  name: string;
  description: string;
  requirements: string;
  sla: string;
  section: string;
  department: string;
}
interface ApiResponse {
  success: boolean;
  data: Complaint[];
}
interface publicApiResponse {
  data: Complaint[];
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

// API error handling
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new ApiError(errorData.message || 'An unknown error occurred', response.status);
  }
  const data = response.json() as Promise<T>;
  return data;
}
export async function handleDataResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.data as T;
}
// Helper function to get authorization header
export function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Helper function to get multipart form headers
function getMultipartHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// Helper function to append language parameter
function withLang(url: string, lang?: string): string {
  if (!lang) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}lang=${lang}`;
}

// Public API functions
export const publicApi = {
  // get subcities
  getSubcities: async (): Promise<Subcities[]> => {
    const response = await fetch(`${API_BASE_URL}/subcities`);
    return handleResponse<Subcities[]>(response);
  },
  // Get all employees
  getComplaints: async (): Promise<Complaint[]> => {
    const response = await fetch(`${API_BASE_URL}/complaints`);
    return handleResponse<Complaint[]>(response);
  },
  getEmployees: async (filters?: { city?: string; subcity?: string; department?: string }) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.subcity) params.append('subcity', filters.subcity);
    if (filters?.department) params.append('department', filters.department);

    const endpoint = `/admin/employees${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiRequest(endpoint);
    // Backend returns array directly, not wrapped in object

    return response;
  },

  getSectors: async (lang?: string): Promise<Sector[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/sectors`, lang));
    return handleDataResponse<Sector[]>(response);
  },
  getDirectors: async (lang?: string): Promise<Division[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/divisions`, lang));
    return handleDataResponse<Division[]>(response);
  },
  // Get departments(teams)
  getDepartments: async (lang?: string): Promise<Department[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/departments`, lang));
    return handleDataResponse<Department[]>(response);
  },
  getExpertise: async (lang?: string): Promise<Team[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/teams`, lang));
    return handleResponse<Team[]>(response);
  },

  // Get offices by department
  getOfficesByDepartment: async (departmentId: number, lang?: string): Promise<Office[]> => {
    const response = await fetch(
      withLang(`${API_BASE_URL}/departments/${departmentId}/offices`, lang)
    );
    return handleResponse<Office[]>(response);
  },

  // Get employee by ID
  getEmployee: async (id: number, lang?: string): Promise<Employee> => {
    const response = await fetch(withLang(`${API_BASE_URL}/team/${id}`, lang));
    return handleResponse<Employee>(response);
  },

  // Get employees by department
  getEmployeesByDepartment: async (departmentId: number, lang?: string): Promise<Employee[]> => {
    const response = await fetch(
      withLang(`${API_BASE_URL}/departments/${departmentId}/employees`, lang)
    );
    return handleResponse<Employee[]>(response);
  },

  // Submit a complaint
  submitComplaint: async (
    formData: FormData,
    lang?: string
  ): Promise<{
    tracking_code: string;
    message: string;
    voice_url?: string;
  }> => {
    const response = await fetch(withLang(`${API_BASE_URL}/complaints/submit`, lang), {
      method: 'POST',
      body: formData,
    });
    return handleResponse<{
      tracking_code: string;
      message: string;
      voice_url?: string;
    }>(response);
  },

  // Submit voice complaint
  submitVoiceComplaint: async (
    formData: FormData,
    lang?: string
  ): Promise<{
    tracking_code: string;
    message: string;
    voice_url?: string;
  }> => {
    const response = await fetch(withLang(`${API_BASE_URL}/complaints/submit-voice`, lang), {
      method: 'POST',
      body: formData,
    });
    return handleResponse<{
      tracking_code: string;
      message: string;
      voice_url?: string;
    }>(response);
  },

  // Track complaint by tracking code or phone number
  trackComplaint: async (identifier: string, lang?: string): Promise<Complaint[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/complaints/track/${identifier}`, lang));
    return handleResponse<Complaint[]>(response);
  },

  // Submit a rating
  submitRating: async (
    data: {
      employee_id: number;
      service_id?: number;
      phone_number: string;
      courtesy: number;
      punctuality: number;
      knowledge: number;
      overall_experience?: string;
      suggestions?: string;
    },
    lang?: string
  ): Promise<{ message: string }> => {
    const response = await fetch(withLang(`${API_BASE_URL}/ratings/submit`, lang), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Get department ratings
  getDepartmentRatings: async (department: string, lang?: string): Promise<Rating[]> => {
    const response = await fetch(
      withLang(`${API_BASE_URL}/ratings/department/${department}`, lang)
    );
    return handleResponse<Rating[]>(response);
  },

  // Submit feedback
  submitFeedback: async (
    data: {
      phone_number: string;
      section: string;
      department?: string;
      employee_id?: number;
      comment: string;
      rating?: number;
    },
    lang?: string
  ): Promise<{ message: string; reference_number: string }> => {
    const response = await fetch(withLang(`${API_BASE_URL}/feedback/submit`, lang), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; reference_number: string }>(response);
  },

  // Check feedback status
  checkFeedbackStatus: async (referenceNumber: string, lang?: string): Promise<Feedback> => {
    const response = await fetch(
      withLang(`${API_BASE_URL}/feedback/status/${referenceNumber}`, lang)
    );
    return handleResponse<Feedback>(response);
  },

  // Get public statistics
  getStatistics: async (lang?: string): Promise<Statistics> => {
    const response = await fetch(withLang(`${API_BASE_URL}/statistics`, lang));
    return handleResponse<Statistics>(response);
  },
};

// Admin API functions
export const adminApi = {
  // Authentication
  login: async (credentials: { username: string; password: string }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Password reset
  requestPasswordReset: async (username: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    return handleResponse<{ message: string }>(response);
  },

  resetPassword: async (data: {
    token: string;
    new_password: string;
  }): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Profile management
  updateProfile: async (
    formData: FormData,
    token: string
  ): Promise<{ message: string; admin: User }> => {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  //sector
  createSector: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/sectors`, {
      method: 'POST',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  updateSector: async (formData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/sectors`, {
      method: 'PUT',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    handleApiSuccess('Sector updated successfully');
    return handleResponse<{ message: string; admin: User }>(response);
  },
  deleteSector: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/sectors`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    handleApiSuccess('Sector updated successfully');
    return handleResponse<{ message: string; admin: string }>(response);
  },
  //director
  createDirector: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/division`, {
      method: 'POST',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  updateDirector: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/division`, {
      method: 'PUT',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  deleteDirector: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/division`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  //team
  createTeam: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/department`, {
      method: 'POST',
      headers: getMultipartHeaders(token),
      body: formData,
    });

    return handleResponse<{ message: string; admin: User }>(response);
  },
  updateTeam: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/department`, {
      method: 'PUT',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  deleteTeam: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/department`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },

  // Employee management
  employees: {
    getAll: async (token: string, lang?: string): Promise<Employee[]> => {
      const response = await fetch(withLang(`${API_BASE_URL}/admin/employees`, lang), {
        headers: getAuthHeaders(token),
      });
      return handleResponse<Employee[]>(response);
    },

    add: async (
      formData: FormData,
      token: string,
      lang?: string
    ): Promise<{ message: string; employee: Employee }> => {
      const response = await fetch(withLang(`${API_BASE_URL}/admin/employees`, lang), {
        method: 'POST',
        headers: getMultipartHeaders(token),
        body: formData,
      });
      return handleResponse<{ message: string; employee: Employee }>(response);
    },

    update: async (
      id: number,
      formData: FormData,
      token: string,
      lang?: string
    ): Promise<{ message: string; employee: Employee }> => {
      const response = await fetch(withLang(`${API_BASE_URL}/admin/employees/${id}`, lang), {
        method: 'PUT',
        headers: getMultipartHeaders(token),
        body: formData,
      });
      return handleResponse<{ message: string; employee: Employee }>(response);
    },

    delete: async (id: number, token: string): Promise<{ message: string }> => {
      const response = await fetch(`${API_BASE_URL}/admin/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      });
      return handleResponse<{ message: string }>(response);
    },
  },

  // Complaint management
  getComplaints: async (token: string, lang?: string): Promise<Complaint[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/complaints`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Complaint[]>(response);
  },

  resolveComplaint: async (
    id: number,
    token: string,
    response_text?: string
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/complaints/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ response: response_text }),
    });
    return handleResponse<{ message: string }>(response);
  },

  getComplaintTrends: async (token: string): Promise<TrendData[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/complaints/trends`, {
      headers: getAuthHeaders(token),
    });
    return handleResponse<TrendData[]>(response);
  },

  // Public complaints management
  getPublicComplaints: async (token: string, lang?: string): Promise<Complaint[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/complaints`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });
      return handleResponse<Complaint[]>(response);
    } catch (error) {
      console.error('error while getting public complaint ', error);
      return [];
    }
  },

  getPublicComplaint: async (id: number, token: string, lang?: string): Promise<Complaint> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/public/complaints/${id}`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Complaint>(response);
  },

  resolvePublicComplaint: async (
    id: number,
    token: string,
    response_text?: string
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/public/complaints/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ response: response_text }),
    });
    return handleResponse<{ message: string }>(response);
  },

  respondToComplaint: async (
    id: string,
    token: string,
    response_text: string,
    status: string
  ): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/complaints/${id}/response`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ response: response_text, status: status || 'resolved' }),
      });
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Error at responding to complaint', error);
      return { message: 'Error responding to complaint' };
    }
  },

  editPublicComplaintStatus: async (
    id: string,
    token: string,
    status: string,
    complaint_source: string
  ): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/complaints/${id}/resolve`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status: status, complaint_source: complaint_source }),
      });
      if (!response.ok) {
        return { message: 'Error changing status' };
      }
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Error at changing status', error);
      return { message: 'Error at responding to user' };
    }
  },
  respondToPublicComplaint: async (
    id: string,
    token: string,
    response_text: string,
    status: string
  ): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/public/complaints/${id}/response`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ response: response_text, status: status || 'resolved' }),
      });
      if (!response.ok) {
        return { message: 'Error responding to complaint' };
      }
      handleApiSuccess('Response set successfully');
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Error at responding', error);
      handleApiError('Error at responind to complaint');
      return { message: 'Error at responding to user' };
    }
  },

  // Feedback management
  getFeedback: async (token: string, lang?: string): Promise<Feedback[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/feedback`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Feedback[]>(response);
  },

  respondToFeedback: async (
    id: string,
    token: string,
    response_text: string
  ): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/feedback/${id}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ response: response_text }),
    });
    return handleResponse<{ message: string }>(response);
  },
  respondToPublicFeedback: async (
    id: string,
    token: string,
    response_text: string
  ): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/public/feedback/${id}/respond`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ response: response_text }),
      });
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      console.error('Error at responding to public feedback', error);
      return { message: 'Error responding to user' };
    }
  },

  getPublicFeedback: async (token: string, lang?: string): Promise<Feedback[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/public/feedback`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Feedback[]>(response);
  },

  // Get feedback filtered by subcity
  getFeedbackBySubcity: async (subcity: string) => {
    const response = await apiRequest(`/admin/feedback?subcity=${encodeURIComponent(subcity)}`);
    return {
      ...response,
      feedback:
        response.feedback?.map((fb: any) => ({
          ...fb,
          feedback_text: fb.feedback_en || fb.feedback_am || fb.feedback_af || '',
          response_text: fb.response_en || fb.response_am || fb.response_af || '',
          section: fb.section || '',
          rating: fb.rating || 0,
        })) || [],
    };
  },

  // Get public feedback filtered by subcity
  getPublicFeedbackBySubcity: async (subcity: string) => {
    const response = await apiRequest(`/public/feedback?subcity=${encodeURIComponent(subcity)}`);
    return {
      ...response,
      feedback:
        response.feedback?.map((fb: any) => ({
          ...fb,
          feedback_text: fb.feedback_en || fb.feedback_am || fb.feedback_af || '',
          response_text: fb.response_en || fb.response_am || fb.response_af || '',
          section: fb.section || '',
          rating: fb.rating || 0,
        })) || [],
    };
  },

  // Ratings management
  getRatings: async (token: string, lang?: string): Promise<Rating[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/ratings`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Rating[]>(response);
  },

  getPublicRatings: async (token: string, lang?: string): Promise<Rating[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/public/ratings`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Rating[]>(response);
  },

  // Statistics
  getStatistics: async (token: string, lang?: string): Promise<Statistics> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/statistics`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Statistics>(response);
  },

  getStatisticsWithLocation: async (token: string, lang?: string): Promise<Statistics> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/statistics-location`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Statistics>(response);
  },

  // Departments and hierarchy
  getDepartments: async (token: string, lang?: string): Promise<Department[]> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/departments`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<Department[]>(response);
  },

  getLocationHierarchy: async (token: string, lang?: string): Promise<any> => {
    const response = await fetch(withLang(`${API_BASE_URL}/admin/location-hierarchy`, lang), {
      headers: getAuthHeaders(token),
    });
    return handleResponse<any>(response);
  },

  // Admin management (SuperAdmin only)
  createAdmin: async (
    formData: FormData,
    token: string
  ): Promise<{ message: string; admin?: User }> => {
    const response = await fetch(`${API_BASE_URL}/admin`, {
      method: 'POST',
      headers: getMultipartHeaders(token),
      body: formData,
    });
    return handleDataResponse<{ message: string; admin: User }>(response);
  },
  updateAdmin: async (formData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse<{ message: string; admin: User }>(response);
  },
  deleteAdmin: async (id: string, token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = handleResponse<{ message: string; admin: User }>(response);
      return data;
    } catch (error) {
      console.log('error deleting admin', error);
      handleApiError('Error deleting admin');
      return { message: 'Error at deleting admin' };
    }
  },
  getAdmins: async (token: string): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        headers: getAuthHeaders(token),
      });
      const data = await handleDataResponse<User[]>(response);
      return data;
    } catch (error) {
      console.log('error at getting admins', error);
      return [];
    }
  },
  // Reports
  exportReport: async (token: string, params?: any): Promise<Blob> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/admin/export-report?${queryParams.toString()}`, {
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new ApiError('Failed to export report', response.status);
    }

    return response.blob();
  },
};

// Helper function to get the current token
function getAuthToken(): string | null {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
}

// Create axios-like request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));

    // Handle token expiration
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    localStorage.removeItem('authToken');
    return { success: true };
  },

  getProfile: async () => {
    return apiRequest('/admin/profile');
  },
};

// Statistics API - Fixed to match backend structure
export const statisticsApi = {
  getStatistics: async () => {
    try {
      // Get all data separately and combine
      const [
        complaintsRes,
        publicComplaintsRes,
        feedbackRes,
        publicFeedbackRes,
        ratingsRes,
        publicRatingsRes,
        employeesRes,
      ] = await Promise.all([
        apiRequest('/admin/complaints').catch(() => ({ complaints: [] })),
        apiRequest('/public/complaints').catch(() => ({ complaints: [] })),
        apiRequest('/admin/feedback').catch(() => ({ feedback: [] })),
        apiRequest('/public/feedback').catch(() => ({ feedback: [] })),
        apiRequest('/admin/ratings').catch(() => ({ ratings: [] })),
        apiRequest('/public/ratings').catch(() => ({ ratings: [] })),
        apiRequest('/admin/employees').catch(() => ({ employees: [] })),
      ]);

      const totalComplaints =
        (complaintsRes.complaints?.length || 0) + (publicComplaintsRes.complaints?.length || 0);
      const totalFeedback =
        (feedbackRes.feedback?.length || 0) + (publicFeedbackRes.feedback?.length || 0);
      const totalRatings =
        (ratingsRes.ratings?.length || 0) + (publicRatingsRes.ratings?.length || 0);
      const totalEmployees = employeesRes.employees?.length || 0;

      // Calculate resolved complaints
      const resolvedComplaints = [
        ...(complaintsRes.complaints || []),
        ...(publicComplaintsRes.complaints || []),
      ].filter((c) => c.status === 'resolved').length;

      // Calculate average rating
      const allRatings = [...(ratingsRes.ratings || []), ...(publicRatingsRes.ratings || [])];
      const averageRating =
        allRatings.length > 0
          ? allRatings.reduce((acc, rating) => {
              const avg =
                ((rating.courtesy || 0) + (rating.timeliness || 0) + (rating.knowledge || 0)) / 3;
              return acc + avg;
            }, 0) / allRatings.length
          : 0;

      return {
        totalComplaints,
        totalFeedback,
        totalRatings,
        totalEmployees,
        resolvedComplaints,
        averageRating: averageRating.toFixed(1),
        pendingComplaints: totalComplaints - resolvedComplaints,
      };
    } catch (error) {
      console.error('Statistics API error:', error);
      return {
        totalComplaints: 0,
        totalFeedback: 0,
        totalRatings: 0,
        totalEmployees: 0,
        resolvedComplaints: 0,
        averageRating: '0.0',
        pendingComplaints: 0,
      };
    }
  },
};

// Complaints API - Fixed field mapping
export const complaintsApi = {
  getComplaints: async () => {
    const response = await apiRequest('/admin/complaints');
    // Backend returns array directly, not wrapped in object
    const complaints = Array.isArray(response) ? response : response.complaints || [];

    return {
      complaints: complaints.map((complaint: any) => ({
        ...complaint,
        // Map backend fields to frontend expectations
        description:
          complaint.description_en || complaint.description_am || complaint.description_af || '',
        desired_action:
          complaint.desired_action_en ||
          complaint.desired_action_am ||
          complaint.desired_action_af ||
          '',
        response: complaint.response_en || complaint.response_am || complaint.response_af || '',
        // Keep original fields too
        department: complaint.department || '',
        section: complaint.section || '',
        complainant_name: complaint.complainant_name || '',
      })),
    };
  },

  getPublicComplaints: async () => {
    const response = await apiRequest('/public/complaints');
    // Backend returns array directly, not wrapped in object
    const complaints = Array.isArray(response) ? response : response.complaints || [];

    return {
      complaints: complaints.map((complaint: any) => ({
        ...complaint,
        // Map backend fields to frontend expectations
        description:
          complaint.description_en || complaint.description_am || complaint.description_af || '',
        desired_action:
          complaint.desired_action_en ||
          complaint.desired_action_am ||
          complaint.desired_action_af ||
          '',
        response: complaint.response_en || complaint.response_am || complaint.response_af || '',
        // Keep original fields too
        department: complaint.department || '',
        section: complaint.section || '',
        complainant_name: complaint.complainant_name || '',
      })),
    };
  },

  createComplaint: async (complaint: any) => {
    return apiRequest('/admin/complaints', {
      method: 'POST',
      body: JSON.stringify(complaint),
    });
  },

  updateComplaint: async (id: string, complaint: any) => {
    return apiRequest(`/admin/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(complaint),
    });
  },

  deleteComplaint: async (id: string) => {
    return apiRequest(`/admin/complaints/${id}`, {
      method: 'DELETE',
    });
  },

  respondToComplaint: async ({ id, response }: { id: string; response: string }) => {
    return apiRequest(`/admin/complaints/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },

  respondToPublicComplaint: async ({ id, response }: { id: string; response: string }) => {
    return apiRequest(`/public/complaints/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },
};

// Employees API - Fixed field mapping
export const employeesApi = {
  getEmployees: async (filters?: EmployeeFiltersTypes) => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.subcity) params.append('subcity', filters.subcity);
    if (filters?.department) params.append('department', filters.department);

    const endpoint = `/admin/employees${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiRequest(endpoint);

    return response;
  },

  createEmployee: async (token: string, formData: FormData) => {
    console.log(formData);
    return apiRequest('/admin/employees', {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },

      method: 'POST',
      body: formData,
    });
  },

  updateEmployee: async (token: string, data: FormData) => {
    console.log(data);
    return apiRequest(`/admin/employees`, {
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      body: data,
    });
  },

  deleteEmployee: async (id: number) => {
    return apiRequest(`/admin/employees/${id}`, {
      method: 'DELETE',
    });
  },

  // Get employees filtered by subcity
  getEmployeesBySubcity: async (subcity: string) => {
    const params = new URLSearchParams();
    params.append('subcity', subcity);

    const response = await apiRequest(`/admin/employees?${params.toString()}`);
    const employees = Array.isArray(response) ? response : response.employees || [];

    return {
      employees: employees.map((employee: any) => ({
        ...employee,
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        position: employee.position || '',
        department: employee.department || '',
        profile_picture_url: employee.profile_picture || '',
        section: employee.section || '',
        city: employee.city || '',
        subcity: employee.subcity || '',
        office_number: employee.office_number || '',
        floor_number: employee.floor_number || 0,
      })),
    };
  },
};

// Services API
export const servicesApi = {
  getServices: async () => {
    // Since there's no direct services endpoint, we'll get departments from employees
    const response = await apiRequest('/admin/employees');
    const employees = Array.isArray(response) ? response : response.employees || [];

    // Extract unique departments as services
    const departments = [
      ...new Set(
        employees.map(
          (emp: any) =>
            emp.department ||
            emp.department_en ||
            emp.department_am ||
            emp.department_af ||
            'Unknown'
        )
      ),
    ];

    const services = departments.map((dept, index) => ({
      id: index + 1,
      name: dept,
      department: dept,
      description: `Services provided by ${dept} department`,
      category: 'Government Service',
      status: 'active',
      created_at: new Date().toISOString(),
    }));

    return { services };
  },
};

// Feedback API - Fixed field mapping
export const feedbackApi = {
  getFeedback: async () => {
    const response = await apiRequest('/admin/feedback');
    return {
      ...response,
      feedback:
        response.feedback?.map((fb: any) => ({
          ...fb,
          // Map backend fields to frontend expectations
          feedback_text: fb.feedback_en || fb.feedback_am || fb.feedback_af || '',
          response_text: fb.response_en || fb.response_am || fb.response_af || '',
          // Keep original fields
          section: fb.section || '',
          rating: fb.rating || 0,
        })) || [],
    };
  },

  getPublicFeedback: async () => {
    const response = await apiRequest('/public/feedback');
    return {
      ...response,
      feedback:
        response.feedback?.map((fb: any) => ({
          ...fb,
          // Map backend fields to frontend expectations
          feedback_text: fb.feedback_en || fb.feedback_am || fb.feedback_af || '',
          response_text: fb.response_en || fb.response_am || fb.response_af || '',
          // Keep original fields
          section: fb.section || '',
          rating: fb.rating || 0,
        })) || [],
    };
  },

  createFeedback: async (feedback: any) => {
    return apiRequest('/admin/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },

  respondToFeedback: async ({ id, response }: { id: string; response: string }) => {
    return apiRequest(`/admin/feedback/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },

  respondToPublicFeedback: async ({ id, response }: { id: string; response: string }) => {
    return apiRequest(`/public/feedback/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  },
};

// Ratings API
export const ratingsApi = {
  getRatings: async () => {
    const response = await apiRequest('/admin/ratings');
    return response;
  },

  getPublicRatings: async () => {
    const response = await apiRequest('/public/ratings');
    return response;
  },

  createRating: async (rating: any) => {
    return apiRequest('/admin/ratings', {
      method: 'POST',
      body: JSON.stringify(rating),
    });
  },
};

// Subcity-specific API functions
export const subcityApi = {
  // Get employees by subcity
  getEmployeesBySubcity: async (subcity: string) => {
    const params = new URLSearchParams();
    params.append('subcity', subcity);

    const response = await apiRequest(`/admin/employees?${params.toString()}`);
    const employees = Array.isArray(response) ? response : response.employees || [];

    return {
      employees: employees.map((employee: any) => ({
        ...employee,
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        position: employee.position || '',
        department: employee.department || '',
        profile_picture_url: employee.profile_picture || '',
        section: employee.section || '',
        city: employee.city || '',
        subcity: employee.subcity || '',
        office_number: employee.office_number || '',
        floor_number: employee.floor_number || 0,
      })),
    };
  },

  // Get complaints by subcity
  getComplaintsBySubcity: async (subcity: string) => {
    const [adminComplaints, publicComplaints] = await Promise.all([
      apiRequest(`/admin/complaints?subcity=${encodeURIComponent(subcity)}`).catch(() => []),
      apiRequest(`/public/complaints?subcity=${encodeURIComponent(subcity)}`).catch(() => []),
    ]);

    const complaints = Array.isArray(adminComplaints)
      ? adminComplaints
      : adminComplaints.complaints || [];
    const publicComplaintsArray = Array.isArray(publicComplaints)
      ? publicComplaints
      : publicComplaints.complaints || [];

    return {
      complaints: complaints.map((complaint: any) => ({
        ...complaint,
        description:
          complaint.description_en || complaint.description_am || complaint.description_af || '',
        desired_action:
          complaint.desired_action_en ||
          complaint.desired_action_am ||
          complaint.desired_action_af ||
          '',
        response: complaint.response_en || complaint.response_am || complaint.response_af || '',
        department: complaint.department || '',
        section: complaint.section || '',
        complainant_name: complaint.complainant_name || '',
      })),
      publicComplaints: publicComplaintsArray.map((complaint: any) => ({
        ...complaint,
        description:
          complaint.description_en || complaint.description_am || complaint.description_af || '',
        desired_action:
          complaint.desired_action_en ||
          complaint.desired_action_am ||
          complaint.desired_action_af ||
          '',
        response: complaint.response_en || complaint.response_am || complaint.response_af || '',
        department: complaint.department || '',
        section: complaint.section || '',
        complainant_name: complaint.complainant_name || '',
      })),
    };
  },

  // Get feedback by subcity
  getFeedbackBySubcity: async (subcity: string) => {
    const [adminFeedback, publicFeedback] = await Promise.all([
      apiRequest(`/admin/feedback?subcity=${encodeURIComponent(subcity)}`).catch(() => ({
        feedback: [],
      })),
      apiRequest(`/public/feedback?subcity=${encodeURIComponent(subcity)}`).catch(() => ({
        feedback: [],
      })),
    ]);

    return {
      feedback: (adminFeedback.feedback || []).map((fb: any) => ({
        ...fb,
        feedback_text: fb.feedback_en || fb.feedback_am || fb.feedback_af || '',
        response_text: fb.response_en || fb.response_am || fb.response_af || '',
        section: fb.section || '',
        rating: fb.rating || 0,
      })),
      publicFeedback: (publicFeedback.feedback || []).map((fb: any) => ({
        ...fb,
        feedback_text: fb.feedback_en || fb.feedback_am || fb.feedback_af || '',
        response_text: fb.response_en || fb.response_am || fb.response_af || '',
        section: fb.section || '',
        rating: fb.rating || 0,
      })),
    };
  },

  // Get ratings by subcity
  getRatingsBySubcity: async (subcity: string) => {
    const [adminRatings, publicRatings] = await Promise.all([
      apiRequest(`/admin/ratings?subcity=${encodeURIComponent(subcity)}`).catch(() => ({
        ratings: [],
      })),
      apiRequest(`/public/ratings?subcity=${encodeURIComponent(subcity)}`).catch(() => ({
        ratings: [],
      })),
    ]);

    return {
      ratings: adminRatings.ratings || [],
      publicRatings: publicRatings.ratings || [],
    };
  },
};

// Export functionality
export const exportApi = {
  exportComplaints: async (format: 'pdf' | 'csv' | 'excel', filters?: any) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
    }
    params.append('format', format);

    const response = await fetch(`${API_BASE_URL}/admin/complaints/export?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  exportEmployees: async (format: 'pdf' | 'csv' | 'excel', filters?: any) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
    }
    params.append('format', format);

    const response = await fetch(`${API_BASE_URL}/admin/employees/export?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  exportFeedback: async (format: 'pdf' | 'csv' | 'excel', filters?: any) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
    }
    params.append('format', format);

    const response = await fetch(`${API_BASE_URL}/admin/feedback/export?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
