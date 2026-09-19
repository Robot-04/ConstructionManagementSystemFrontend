export interface Site {
  id: number;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  manager_id: number | null;
  manager_name: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface SiteResponse {
  success: boolean;
  message?: string;
  data: Site[];
}

export interface SingleSiteResponse {
  success: boolean;
  message?: string;
  data: Site;
}

export interface CreateSiteRequest {
  name: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface UpdateSiteRequest {
  name: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  manager_id?: number | null;
}
