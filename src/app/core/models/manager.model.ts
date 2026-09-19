import { User } from './user.model';

export interface CreateManagerRequest {
  name: string;
  email: string;
  phone?: string;
  role: 'MANAGER';
  site_id?: number | null;
}

export interface UpdateManagerRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'MANAGER';
  is_active?: number;
  site_id?: number | null;
}

export interface UsersResponse {
  success: boolean;
  message?: string;
  data: User[];
}

export interface UserResponse {
  success: boolean;
  message?: string;
  data: User;
}

export interface CreateManagerResponse {
  success: boolean;
  data: {
    id: number;
    defaultPassword: string;
  };
}
