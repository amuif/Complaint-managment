export interface ActivityLog {
  id: number;
  admin_id: number | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity_type: string;
  entity_id: number | null;
  created_at: Date;
}
