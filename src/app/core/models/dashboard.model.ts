export interface RecentOrder {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  manager_name: string;
  site_name: string;
}

export interface AdminDashboard {
  totalManagers: number;
  totalSites: number;
  totalMaterials: number;
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  recentOrders: RecentOrder[];
}

export interface DashboardResponse {
  success: boolean;
  data: AdminDashboard;
}

export interface ManagerAssignedSite {
  id: number;
  name: string;
}

export interface ManagerRecentOrder {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  material_count: number;
}

export interface ManagerDashboard {
  assignedSite: ManagerAssignedSite | null;

  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;

  recentOrders: ManagerRecentOrder[];
}

export interface ManagerDashboardResponse {
  success: boolean;
  data: ManagerDashboard;
}
