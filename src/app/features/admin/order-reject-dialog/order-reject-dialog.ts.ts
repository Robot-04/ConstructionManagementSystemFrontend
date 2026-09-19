import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  X,
  TriangleAlert,
} from 'lucide-angular';

@Component({
  selector: 'app-order-reject-dialog',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './order-reject-dialog.ts.html',
  styleUrl: './order-reject-dialog.ts.scss',
})
export class OrderRejectDialog {
  @Input() isSaving = false;
  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<string>();

  rejectionReason = '';

  readonly X = X;
  readonly TriangleAlert = TriangleAlert;

  close(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }

  confirm(): void {
    const reason = this.rejectionReason.trim();

    if (this.isSaving || !reason) {
      return;
    }

    this.confirmed.emit(reason);
  }
}
