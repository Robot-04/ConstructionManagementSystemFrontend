import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'];

  const currentRole = authService.getRole();

  if (currentRole === requiredRole) {
    return true;
  }

  if (currentRole === 'ADMIN') {
    return router.createUrlTree([
      '/admin/dashboard'
    ]);
  }

  if (currentRole === 'MANAGER') {
    return router.createUrlTree([
      '/manager/dashboard'
    ]);
  }

  return router.createUrlTree(['/login']);
};
