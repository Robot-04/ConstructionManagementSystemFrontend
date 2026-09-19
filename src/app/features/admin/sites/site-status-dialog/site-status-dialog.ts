import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  LucideAngularModule,
  AlertTriangle,
  Power,
  RotateCcw,
  X
} from 'lucide-angular';

import { SiteService } from '../../../../core/services/site.service';
import { Site } from '../../../../core/models/site.model';

@Component({
  selector: 'app-site-status-dialog',
  imports: [
    LucideAngularModule
  ],
  templateUrl: './site-status-dialog.html',
  styleUrl: './site-status-dialog.scss'
})
export class SiteStatusDialog {

  private readonly siteService = inject(SiteService);

  @Input({ required: true })
  site!: Site;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  changed = new EventEmitter<void>();

  isSaving = false;
  errorMessage = '';

  readonly AlertTriangle = AlertTriangle;
  readonly Power = Power;
  readonly RotateCcw = RotateCcw;
  readonly X = X;

  get isActive(): boolean {
    return this.site.is_active === 1;
  }

  get hasManager(): boolean {
    return this.site.manager_id !== null;
  }

  get actionTitle(): string {
    return this.isActive
      ? 'Deactivate Site'
      : 'Restore Site';
  }

  get actionText(): string {
    return this.isActive
      ? 'Deactivate'
      : 'Restore';
  }

  get description(): string {
    return this.isActive
      ? `Are you sure you want to deactivate "${this.site.name}"?`
      : `Are you sure you want to restore "${this.site.name}"?`;
  }

  get canDeactivate(): boolean {
    return this.isActive && !this.hasManager;
  }

  close(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }

  confirmStatusChange(): void {
    this.errorMessage = '';

    if (this.isActive && this.hasManager) {
      this.errorMessage =
        'This site cannot be deactivated while a manager is assigned. Please unassign the manager first.';
      return;
    }

    this.isSaving = true;

    const request$ = this.isActive
      ? this.siteService.deleteSite(this.site.id)
      : this.siteService.restoreSite(this.site.id);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.changed.emit();
        this.closed.emit();
      },

      error: error => {
        console.error(
          'Site status change failed:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to update site status. Please try again.';

        this.isSaving = false;
      }
    });
  }
}
