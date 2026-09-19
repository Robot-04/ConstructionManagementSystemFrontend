import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Users,
  Building2,
  Package,
  ClipboardList
} from 'lucide-angular';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AdminDashboard as AdminDashboardData } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);
  private readonly cdr = inject(ChangeDetectorRef); // Add ChangeDetectorRef

  readonly Users = Users;
  readonly Building2 = Building2;
  readonly Package = Package;
  readonly ClipboardList = ClipboardList;



  dashboard: AdminDashboardData | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService
      .getAdminDashboard()
      .subscribe({
        next: response => {
          this.dashboard = response.data;
          this.isLoading = false;
          this.cdr.markForCheck(); // Explicitly notify Angular of changes
        },
        error: error => {
          console.error('Dashboard loading failed:', error);
          this.errorMessage =
            error?.error?.message || 'Unable to load dashboard data.';
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
