import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import {
  LucideAngularModule,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ClipboardList,
  Settings,
  LogOut,
} from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  imports: [
    LucideAngularModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly Building2 = Building2;
  readonly Package = Package;
  readonly ClipboardList = ClipboardList;
  readonly Settings = Settings;
  readonly LogOut = LogOut;

  get role(): UserRole | null {
    return this.authService.getRole();
  }

  get isAdmin(): boolean {
    return this.role === 'ADMIN';
  }

  get isManager(): boolean {
    return this.role === 'MANAGER';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
