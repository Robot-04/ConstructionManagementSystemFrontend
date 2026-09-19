import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  LucideAngularModule,
  UserX,
  UserCheck,
  X,
  AlertTriangle
} from 'lucide-angular';

import { ManagerService } from '../../../../core/services/manager.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-manager-status-dialog',
  imports: [LucideAngularModule],
  templateUrl: './manager-status-dialog.html',
  styleUrl: './manager-status-dialog.scss'
})
export class ManagerStatusDialog {

  private readonly managerService = inject(ManagerService);

  @Input({ required: true })
  manager!: User;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  changed = new EventEmitter<void>();

  readonly UserX = UserX;
  readonly UserCheck = UserCheck;
  readonly X = X;
  readonly AlertTriangle = AlertTriangle;

  isSaving = false;
  errorMessage = '';

  get isActive(): boolean {
    return this.manager?.is_active === 1;
  }

  get hasAssignedSite(): boolean {
    return !!this.manager?.site_id;
  }

  get canDeactivate(): boolean {
    return this.isActive && !this.hasAssignedSite;
  }

  get actionText(): string {
    return this.isActive ? 'Deactivate' : 'Restore';
  }

  get actionTitle(): string {
    return this.isActive
      ? 'Deactivate Manager'
      : 'Restore Manager';
  }

  get description(): string {
    if (!this.isActive) {
      return 'This manager will be restored and marked as active in the system.';
    }

    if (this.hasAssignedSite) {
      return 'This manager cannot be deactivated while they are assigned to a site. Please unassign the manager from the site first.';
    }

    return 'This manager will be marked as inactive and will no longer be considered active in the system.';
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDialog();
    }
  }

  closeDialog(): void {
    if (this.isSaving) {
      return;
    }

    this.closed.emit();
  }

  confirmStatusChange(): void {
    if (this.isSaving || !this.manager?.id) {
      return;
    }

    // Prevent deactivation when the manager is assigned to a site.
    if (this.isActive && this.hasAssignedSite) {
      this.errorMessage =
        'This manager cannot be deactivated because they are currently assigned to a site. Please unassign the manager first.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const managerId = this.manager.id;
    const isCurrentlyActive = this.isActive;

    const request$ = isCurrentlyActive
      ? this.managerService.deleteManager(managerId)
      : this.managerService.restoreManager(managerId);

    request$.subscribe({
      next: response => {
        console.log(
          `Manager ${isCurrentlyActive ? 'deactivated' : 'restored'}:`,
          response
        );

        this.isSaving = false;
        this.changed.emit();
      },

      error: error => {
        console.error(
          `Manager ${isCurrentlyActive ? 'deactivation' : 'restore'} failed:`,
          error
        );

        this.errorMessage =
          error?.error?.message ||
          `Unable to ${
            isCurrentlyActive ? 'deactivate' : 'restore'
          } manager.`;

        this.isSaving = false;
      }
    });
  }
}
