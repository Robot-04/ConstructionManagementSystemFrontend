import { OrderService } from './../../../../core/services/order.service';
import { CreateOrderDto } from './../../../../core/models/order.model';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Package,
  Search,
  Minus,
  Plus,
  ShoppingCart,
  RefreshCw,
  TriangleAlert,
} from 'lucide-angular';

import { Material } from '../../../../core/models/material.model';
import { MaterialService } from '../../../../core/services/material.service';
import { OrderReviewDialog } from '../order-review-dialog/order-review-dialog';
import { ReviewOrderItem } from '../order-review-dialog/order-review-dialog';
import { Router } from '@angular/router';
import { OrderSuccessDialog } from '../order-success-dialog/order-success-dialog';

interface MaterialOrderItem {
  material: Material;
  quantity: number;
}

@Component({
  selector: 'app-material-order',
  standalone: true,
  imports: [
    FormsModule,
    LucideAngularModule,
    OrderReviewDialog,
    OrderSuccessDialog
  ],
  templateUrl: './material-order.html',
  styleUrl: './material-order.scss',
})

export class MaterialOrder implements OnInit {
  private readonly materialService = inject(MaterialService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly orderService = inject(OrderService);

  materials: Material[] = [];
  filteredMaterials: Material[] = [];

  searchTerm = '';

  isLoading = false;
  errorMessage = '';

  isReviewDialogOpen = false;
  reviewItems: ReviewOrderItem[] = [];

  isPlacingOrder = false;
  orderErrorMessage = '';

  isSuccessDialogOpen = false;
  placedOrderId: number | null = null;

  readonly selectedQuantities = new Map<number, number>();
  readonly Package = Package;
  readonly Search = Search;
  readonly Minus = Minus;
  readonly Plus = Plus;
  readonly ShoppingCart = ShoppingCart;
  readonly RefreshCw = RefreshCw;
  readonly TriangleAlert = TriangleAlert;

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.materialService.getAllMaterials().subscribe({
      next: (response) => {
        this.materials = response.data.filter(
          (material) => Boolean(material.is_active)
        );

        this.onSearch();

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          'Failed to load materials. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      this.filteredMaterials = [...this.materials];
      return;
    }

    this.filteredMaterials = this.materials.filter((material) =>
      material.name.toLowerCase().includes(search) ||
      material.unit.toLowerCase().includes(search) ||
      material.description?.toLowerCase().includes(search)
    );
  }

  getQuantity(materialId: number): number {
    return this.selectedQuantities.get(materialId) ?? 0;
  }

  increaseQuantity(material: Material): void {
    const currentQuantity = this.getQuantity(material.id);

    this.selectedQuantities.set(
      material.id,
      currentQuantity + 1
    );

    this.cdr.detectChanges();
  }

  decreaseQuantity(material: Material): void {
    const currentQuantity = this.getQuantity(material.id);

    if (currentQuantity <= 0) {
      return;
    }

    if (currentQuantity === 1) {
      this.selectedQuantities.delete(material.id);
    } else {
      this.selectedQuantities.set(
        material.id,
        currentQuantity - 1
      );
    }

    this.cdr.detectChanges();
  }

  updateQuantity(material: Material, value: number | string): void {
    const quantity = Number(value);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      this.selectedQuantities.delete(material.id);
      this.cdr.detectChanges();
      return;
    }

    this.selectedQuantities.set(
      material.id,
      Math.floor(quantity)
    );

    this.cdr.detectChanges();
  }

  get selectedItemCount(): number {
    return this.selectedQuantities.size;
  }

  get selectedTotalQuantity(): number {
    let total = 0;

    this.selectedQuantities.forEach((quantity) => {
      total += quantity;
    });

    return total;
  }

  get hasSelectedMaterials(): boolean {
    return this.selectedQuantities.size > 0;
  }

  openReviewDialog(): void {
    this.reviewItems = this.materials
      .filter((material) => this.selectedQuantities.has(material.id))
      .map((material) => ({
        material,
        quantity: this.getQuantity(material.id),
      }));

    if (this.reviewItems.length === 0) {
      return;
    }

    this.orderErrorMessage = '';
    this.isReviewDialogOpen = true;
  }

  closeReviewDialog(): void {
    if (this.isPlacingOrder) {
      return;
    }

    this.isReviewDialogOpen = false;
    this.reviewItems = [];
    this.orderErrorMessage = '';
  }

  placeOrder(): void {
    if (this.isPlacingOrder || this.reviewItems.length === 0) {
      return;
    }

    const order: CreateOrderDto = {
      items: this.reviewItems.map((item) => ({
        material_id: item.material.id,
        quantity: item.quantity,
      })),
    };

    this.isPlacingOrder = true;
    this.orderErrorMessage = '';

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        this.isPlacingOrder = false;

        this.placedOrderId = response.data.id;

        this.isReviewDialogOpen = false;
        this.isSuccessDialogOpen = true;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isPlacingOrder = false;

        this.orderErrorMessage =
          error?.error?.message ||
          'Failed to place order. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  retry(): void {
    this.loadMaterials();
  }

  closeSuccessDialog(): void {
    this.isSuccessDialogOpen = false;

    this.selectedQuantities.clear();
    this.reviewItems = [];
    this.placedOrderId = null;

    this.cdr.detectChanges();
  }

  viewMyOrders(): void {
    this.isSuccessDialogOpen = false;

    this.selectedQuantities.clear();
    this.reviewItems = [];
    this.placedOrderId = null;

    this.router.navigate(['/manager/orders']);
  }
}
