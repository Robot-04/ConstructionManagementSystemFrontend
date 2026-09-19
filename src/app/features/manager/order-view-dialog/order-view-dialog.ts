import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  X,
  ClipboardList,
  Package,
  Building2,
  Clock3,
  CheckCircle2,
  XCircle,
  TriangleAlert,
} from 'lucide-angular';

import { ManagerOrderDetails } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-view-dialog',
  standalone: true,
  imports: [
    LucideAngularModule,
    DatePipe,
  ],
  templateUrl: './order-view-dialog.html',
  styleUrl: './order-view-dialog.scss',
})
export class OrderViewDialog {
  @Input({ required: true })
  order!: ManagerOrderDetails;

  @Output()
  closed = new EventEmitter<void>();

  readonly X = X;
  readonly ClipboardList = ClipboardList;
  readonly Package = Package;
  readonly Building2 = Building2;
  readonly Clock3 = Clock3;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly TriangleAlert = TriangleAlert;

  close(): void {
    this.closed.emit();
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

  getStatusClass(): string {
    switch (this.order.status) {
      case 'PENDING':
        return 'order-view-dialog__status--pending';

      case 'APPROVED':
        return 'order-view-dialog__status--approved';

      case 'REJECTED':
        return 'order-view-dialog__status--rejected';

      default:
        return '';
    }
  }
}
