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
  AdminOrder,
  OrderStatus,
} from '../../../core/models/order.model';
import { AdminOrderViewDialog } from '../order-view-dialog/order-view-dialog';
import { AdminOrderDetails } from '../../../core/models/order.model';
import { OrderRejectDialog } from '../order-reject-dialog/order-reject-dialog.ts';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [LucideAngularModule, DatePipe, AdminOrderViewDialog, OrderRejectDialog],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly cdr = inject(ChangeDetectorRef);

  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];

  selectedStatus: 'ALL' | OrderStatus = 'ALL';

  isLoading = false;
  errorMessage = '';

  selectedOrder: AdminOrderDetails | null = null;

  isViewDialogOpen = false;

  isOrderLoading = false;

  orderErrorMessage = '';
  isActionLoading = false;
  orderActionError = '';

  isRejectDialogOpen = false;
  isRejectingOrder = false;
  rejectErrorMessage = '';

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

    this.orderService.getAllOrders().subscribe({
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
      (order) => order.status === this.selectedStatus
    );
  }

  getStatusCount(status: 'ALL' | OrderStatus): number {
    if (status === 'ALL') {
      return this.orders.length;
    }

    return this.orders.filter(
      (order) => order.status === status
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

  retry(): void {
    this.loadOrders();
  }

  viewOrder(order: AdminOrder): void {
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

  approveOrder(): void {
    if (!this.selectedOrder || this.selectedOrder.status !== 'PENDING') {
      return;
    }

    this.isActionLoading = true;
    this.orderActionError = '';

    this.orderService.approveOrder(this.selectedOrder.id).subscribe({
      next: () => {
        this.isActionLoading = false;

        this.isViewDialogOpen = false;
        this.selectedOrder = null;

        this.loadOrders();

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isActionLoading = false;
        this.orderActionError =
          error?.error?.message ||
          'Failed to approve order. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  openRejectDialog(): void {
    if (
      !this.selectedOrder ||
      this.selectedOrder.status !== 'PENDING' ||
      this.isActionLoading
    ) {
      return;
    }

    this.rejectErrorMessage = '';
    this.isRejectDialogOpen = true;
  }

  closeRejectDialog(): void {
    if (this.isRejectingOrder) {
      return;
    }

    this.isRejectDialogOpen = false;
    this.rejectErrorMessage = '';
  }

  rejectOrder(rejectionReason: string): void {
    if (
      !this.selectedOrder ||
      this.selectedOrder.status !== 'PENDING' ||
      this.isRejectingOrder
    ) {
      return;
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      return;
    }

    this.isRejectingOrder = true;
    this.rejectErrorMessage = '';

    this.orderService
      .rejectOrder(this.selectedOrder.id, reason)
      .subscribe({
        next: () => {
          this.isRejectingOrder = false;
          this.isRejectDialogOpen = false;
          this.isViewDialogOpen = false;

          this.selectedOrder = null;
          this.loadOrders();

          this.cdr.detectChanges();
        },

        error: (error) => {
          this.isRejectingOrder = false;
          this.rejectErrorMessage =
            error?.error?.message ||
            'Failed to reject order. Please try again.';

          this.cdr.detectChanges();
        },
      });
  }
}
