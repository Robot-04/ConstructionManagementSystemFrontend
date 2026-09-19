import { Component, inject, OnInit } from '@angular/core';
import { Theme, ThemeService } from '../../../core/services/theme.service';
import {
  LucideAngularModule,
  Menu,
  Sun,
  Moon,
} from 'lucide-angular';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  pageTitle = 'Dashboard';
  pageSubtitle = 'Construction Management';

  user: User | null = null;

  readonly Menu = Menu;
  readonly Sun = Sun;
  readonly Moon = Moon;

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  get currentTheme(): Theme {
    return this.themeService.getTheme();
  }

  get userName(): string {
    return this.user?.name ?? 'User';
  }

  get userRole(): string {
    if (this.user?.role === 'ADMIN') {
      return 'Administrator';
    }

    if (this.user?.role === 'MANAGER') {
      return 'Site Manager';
    }

    return 'User';
  }

  get userInitial(): string {
    return this.user?.name?.charAt(0).toUpperCase() ?? 'U';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.updateHeader();

    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateHeader();
        this.user = this.authService.getUser();
      });
  }

  private updateHeader(): void {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.snapshot.data;

    this.pageTitle =
      data['title'] ?? 'Dashboard';

    this.pageSubtitle =
      data['subtitle'] ?? 'Construction Management';
  }
}
