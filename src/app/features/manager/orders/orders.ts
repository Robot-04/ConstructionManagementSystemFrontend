import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  RefreshCw,
  TriangleAlert,
  Eye,
} from 'lucide-angular';

import { OrderService } from '../../../core/services/order.service';
import {
  ManagerOrder,
  ManagerOrderDetails,
  OrderStatus,
} from '../../../core/models/order.model';
import { OrderViewDialog } from '../order-view-dialog/order-view-dialog';

@Component({
  selector: 'app-manager-orders',
  standalone: true,
  imports: [
    LucideAngularModule,
    DatePipe,
    OrderViewDialog,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class ManagerOrders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly cdr = inject(ChangeDetectorRef);

  orders: ManagerOrder[] = [];
  filteredOrders: ManagerOrder[] = [];

  selectedStatus: 'ALL' | OrderStatus = 'ALL';

  isLoading = false;
  errorMessage = '';

  selectedOrder: ManagerOrderDetails | null = null;

  isViewDialogOpen = false;
  isOrderLoading = false;
  orderErrorMessage = '';

  readonly ClipboardList = ClipboardList;
  readonly Clock3 = Clock3;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly RefreshCw = RefreshCw;
  readonly TriangleAlert = TriangleAlert;
  readonly Eye = Eye;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        this.orders = response.data;
        this.applyFilter();

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load orders. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  selectStatus(status: 'ALL' | OrderStatus): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(
      order => order.status === this.selectedStatus
    );
  }

  getStatusCount(status: 'ALL' | OrderStatus): number {
    if (status === 'ALL') {
      return this.orders.length;
    }

    return this.orders.filter(
      order => order.status === status
    ).length;
  }

  getStatusIcon(status: OrderStatus) {
    switch (status) {
      case 'PENDING':
        return this.Clock3;

      case 'APPROVED':
        return this.CheckCircle2;

      case 'REJECTED':
        return this.XCircle;

      default:
        return this.ClipboardList;
    }
  }

  viewOrder(order: ManagerOrder): void {
    this.selectedOrder = null;
    this.orderErrorMessage = '';
    this.isOrderLoading = true;
    this.isViewDialogOpen = true;

    this.orderService.getOrderById(order.id).subscribe({
      next: (response) => {
        this.selectedOrder = response.data;
        this.isOrderLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isOrderLoading = false;
        this.orderErrorMessage =
          error?.error?.message ||
          'Failed to load order details. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  closeViewDialog(): void {
    if (this.isOrderLoading) {
      return;
    }

    this.isViewDialogOpen = false;
    this.selectedOrder = null;
    this.orderErrorMessage = '';
  }

  retry(): void {
    this.loadOrders();
  }
}
