import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideAngularModule,
  CheckCircle2,
  ClipboardList,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-order-success-dialog',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './order-success-dialog.html',
  styleUrl: './order-success-dialog.scss',
})
export class OrderSuccessDialog {
  @Input({ required: true }) orderId!: number;

  @Output() closed = new EventEmitter<void>();

  @Output() viewOrders = new EventEmitter<void>();

  readonly CheckCircle2 = CheckCircle2;
  readonly ClipboardList = ClipboardList;
  readonly X = X;

  close(): void {
    this.closed.emit();
  }

  goToOrders(): void {
    this.viewOrders.emit();
  }
}
