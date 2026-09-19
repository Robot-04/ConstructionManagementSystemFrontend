import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideAngularModule,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  Building2,
  Package,
  RefreshCw,
  TriangleAlert,
} from 'lucide-angular';

import { DashboardService } from '../../../core/services/dashboard.service';
import {
  ManagerDashboard as ManagerDashboardData,
} from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [LucideAngularModule, DatePipe],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.scss',
})
export class ManagerDashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly cdr = inject(ChangeDetectorRef);

  dashboard: ManagerDashboardData | null = null;

  isLoading = false;
  errorMessage = '';

  readonly ClipboardList = ClipboardList;
  readonly Clock3 = Clock3;
  readonly CheckCircle2 = CheckCircle2;
  readonly XCircle = XCircle;
  readonly Building2 = Building2;
  readonly Package = Package;
  readonly RefreshCw = RefreshCw;
  readonly TriangleAlert = TriangleAlert;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getManagerDashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load dashboard. Please try again.';

        this.cdr.detectChanges();
      },
    });
  }

  retry(): void {
    this.loadDashboard();
  }
}
