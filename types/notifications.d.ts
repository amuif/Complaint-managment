export interface ActivityLog {
  id: number;
  admin_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  details: NotificationDetails;
  sector_id: number;
  subcity_id: number;
  created_at: string;
  admin: Resolver;
  sector: Sector;
  subcity: Subcity;
}

export interface NotificationDetails {
  phone_number?: string;
  complaint_type?: string;
  priority?: string;
  old_status?: string;
  new_status?: string;
  assigned_to?: string;
  note_preview?: string;
  [key: string]: any; // For additional dynamic properties
}

export interface Resolver {
  id: number;
  username: string;
  email?: string;
  role?: string;
}

export interface Sector {
  id: number;
  name_en: string;
  name_am: string;
  name_af: string;
  office_number?: string;
  profile_picture?: string;
  appointed_person_en?: string;
  appointed_person_am?: string;
  appointed_person_af?: string;
  created_at?: string;
}

export interface Subcity {
  id: number;
  name_en: string;
  name_am: string;
  name_af: string;
  appointed_person_en?: string;
  appointed_person_am?: string;
  appointed_person_af?: string;
  created_at?: string;
  updated_at?: string;
}

// For the API response
export interface NotificationsResponse {
  success: boolean;
  logs?: Notification[];
  message?: string;
  error?: string;
}

// For component props
export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  className?: string;
}

// For filtering options
export interface NotificationFilters {
  action?: string;
  entity_type?: string;
  sector_id?: number;
  subcity_id?: number;
  start_date?: string;
  end_date?: string;
  admin_id?: number;
}
