import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  X,
  ClipboardList,
  Package,
  Building2,
  User,
  Clock3,
  CheckCircle2,
  XCircle,
  TriangleAlert,
} from 'lucide-angular';

import { OrderStatus, AdminOrderDetails } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-order-view-dialog',
  standalone: true,
  imports: [LucideAngularModule, DatePipe],
  templateUrl: './order-view-dialog.html',
  styleUrl: './order-view-dialog.scss',
})
export class AdminOrderViewDialog {
  @Input({ required: true }) order!: AdminOrderDetails;

  @Input() isActionLoading = false;

  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();

  @Output() approve = new EventEmitter<void>();

  @Output() reject = new EventEmitter<void>();

  readonly X = X;
  readonly ClipboardList = ClipboardList;
  readonly Package = Package;
  readonly Building2 = Building2;
  readonly User = User;
  readonly Clock3 = Clock3;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly TriangleAlert = TriangleAlert;

  close(): void {
    if (this.isActionLoading) {
      return;
    }

    this.closed.emit();
  }

  approveOrder(): void {
    console.log('APPROVE BUTTON CLICKED');

    if (this.isActionLoading || this.order.status !== 'PENDING') {
      console.log('Approve blocked:', {
        isActionLoading: this.isActionLoading,
        status: this.order.status,
      });
      return;
    }

    console.log('EMITTING APPROVE EVENT');

    this.approve.emit();
  }

  rejectOrder(): void {
    if (this.isActionLoading || this.order.status !== 'PENDING') {
      return;
    }

    this.reject.emit();
  }

  getStatusIcon() {
    switch (this.order.status) {
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
}
