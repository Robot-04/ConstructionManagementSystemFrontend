export type UserRole = 'ADMIN' | 'MANAGER';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  is_active: number;
  site_id?: number | null;
  created_at: string;
  updated_at: string;
}
