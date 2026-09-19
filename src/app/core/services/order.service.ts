import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  CreateOrderDto,
  CreateOrderResponse,
  OrdersListResponse,
  OrderDetailsResponse,
  AdminOrdersListResponse,
  AdminOrderDetails,
} from '../models/order.model';

@Injectable({
  providedIn: 'root',
})

export class OrderService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  createOrder(order: CreateOrderDto): Observable<CreateOrderResponse> {
    return this.http.post<CreateOrderResponse>(
      `${this.apiUrl}/order`,
      order
    );
  }

  getMyOrders(): Observable<OrdersListResponse> {
    return this.http.get<OrdersListResponse>(
      `${this.apiUrl}/order/my-orders`
    );
  }

  getOrderById(id: number): Observable<OrderDetailsResponse> {
    return this.http.get<OrderDetailsResponse>(
      `${this.apiUrl}/order/${id}`
    );
  }

  getAllOrders(): Observable<AdminOrdersListResponse> {
    return this.http.get<AdminOrdersListResponse>(
      `${this.apiUrl}/order`
    );
  }

  approveOrder(id: number): Observable<{
    success: boolean;
    message: string;
    data: AdminOrderDetails;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data: AdminOrderDetails;
    }>(`${this.apiUrl}/order/${id}/approve`, {});
  }

  rejectOrder(
    id: number,
    rejection_reason: string
  ): Observable<{
    success: boolean;
    message: string;
    data: AdminOrderDetails;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
      data: AdminOrderDetails;
    }>(`${this.apiUrl}/order/${id}/reject`, {
      rejection_reason,
    });
  }
}
