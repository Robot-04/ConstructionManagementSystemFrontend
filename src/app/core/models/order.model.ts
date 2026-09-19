export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreateOrderItemDto {
  material_id: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
  };
}

export interface ManagerOrder {
  id: number;
  status: OrderStatus;
  rejection_reason: string | null;
  created_at: string;
  site: {
    id: number;
    name: string;
  };
}

export interface ManagerOrderDetails {
  id: number;
  status: OrderStatus;
  rejection_reason: string | null;
  created_at: string;
  site: {
    id: number;
    name: string;
  };
  manager: {
    id: number;
    name: string;
  };
  items: OrderItemDetails[];
}

export interface OrderItemDetails {
  material_id: number;
  material_name: string;
  unit: string;
  quantity: number;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: ManagerOrder[];
}

export interface OrderDetailsResponse {
  success: boolean;
  message: string;
  data: ManagerOrderDetails;
}

export interface AdminOrder {
  id: number;
  status: OrderStatus;
  created_at: string;
  site: {
    id: number;
    name: string;
  };
  manager: {
    id: number;
    name: string;
  };
}

export interface AdminOrdersListResponse {
  success: boolean;
  message: string;
  data: AdminOrder[];
}

export interface AdminOrderDetails {
  id: number;
  status: OrderStatus;
  rejection_reason: string | null;
  created_at: string;
  site: {
    id: number;
    name: string;
  };
  manager: {
    id: number;
    name: string;
  };
  items: OrderItemDetails[];
}
