import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, X, Package, ShoppingCart } from 'lucide-angular';
import { Material } from '../../../../core/models/material.model';

export interface ReviewOrderItem {
  material: Material;
  quantity: number;
}

@Component({
  selector: 'app-order-review-dialog',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './order-review-dialog.html',
  styleUrl: './order-review-dialog.scss',
})
export class OrderReviewDialog {
  @Input({ required: true }) items: ReviewOrderItem[] = [];

  @Input() isSaving = false;

  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();

  @Output() confirmed = new EventEmitter<void>();

  readonly X = X;
  readonly Package = Package;
  readonly ShoppingCart = ShoppingCart;

  close(): void {
    if (this.isSaving) return;

    this.closed.emit();
  }

  confirm(): void {
    if (this.isSaving || this.items.length === 0) return;

    this.confirmed.emit();
  }

  getTotalQuantity(): number {
    return this.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}
