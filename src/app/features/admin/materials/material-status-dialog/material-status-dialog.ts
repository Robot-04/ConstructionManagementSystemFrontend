import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  LucideAngularModule,
  X,
  Ban,
  RotateCcw,
  TriangleAlert,
} from 'lucide-angular';

import { Material } from '../../../../core/models/material.model';

@Component({
  selector: 'app-material-status-dialog',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './material-status-dialog.html',
  styleUrl: './material-status-dialog.scss',
})
export class MaterialStatusDialog {

  @Input({ required: true }) material!: Material;

  @Input() isSaving = false;

  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();

  @Output() confirmed = new EventEmitter<void>();


  // --------------------------------------------------
  // Icons
  // --------------------------------------------------

  readonly X = X;
  readonly Ban = Ban;
  readonly RotateCcw = RotateCcw;
  readonly TriangleAlert = TriangleAlert;


  // --------------------------------------------------
  // Close
  // --------------------------------------------------

  close(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }


  // --------------------------------------------------
  // Confirm
  // --------------------------------------------------

  confirm(): void {
    if (this.isSaving) {
      return;
    }

    this.confirmed.emit();
  }


  // --------------------------------------------------
  // Action Text
  // --------------------------------------------------

  get isActive(): boolean {
    return Boolean(this.material?.is_active);
  }

  get actionTitle(): string {
    return this.isActive
      ? 'Deactivate Material'
      : 'Activate Material';
  }

  get actionDescription(): string {
    return this.isActive
      ? 'Are you sure you want to deactivate this material?'
      : 'Are you sure you want to activate this material?';
  }

  get actionButtonText(): string {
    return this.isActive
      ? 'Deactivate'
      : 'Activate';
  }
}
