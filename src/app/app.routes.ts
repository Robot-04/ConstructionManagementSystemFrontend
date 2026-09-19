import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard.guard';
import { roleGuard } from './core/guards/role-guard.guard';

import { AdminLayout } from './layout/admin-layout/admin-layout';
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { Orders } from './features/admin/orders/orders';

export const routes: Routes = [

  // ========================================
  // Default
  // ========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // ========================================
  // Authentication
  // ========================================

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login),
  },

  // ========================================
  // Admin
  // ========================================

  {
    path: 'admin',
    component: AdminLayout,

    children: [

      {
        path: 'dashboard',
        component: AdminDashboard,
        data: {
          title: 'Dashboard',
          subtitle: 'Construction Management',
        },
      },

      {
        path: 'managers',
        loadChildren: () =>
          import('./features/admin/managers/manager.routes')
            .then(m => m.MANAGER_ROUTES),
      },

      {
        path: 'sites',
        loadChildren: () =>
          import('./features/admin/sites/site.route')
            .then(m => m.SITE_ROUTES),
      },

      {
        path: 'materials',
        loadChildren: () =>
          import('./features/admin/materials/material.routes')
            .then(m => m.MATERIAL_ROUTES),
      },

      {
        path: 'orders',
        component: Orders,
        data: {
          title: 'Orders',
          subtitle: 'Review material orders',
        },
      },

    ],
  },

  // ========================================
  // Manager
  // ========================================

  {
    path: 'manager',

    canActivate: [
      authGuard,
      roleGuard,
    ],

    data: {
      role: 'MANAGER',
    },

    loadComponent: () =>
      import('./layout/manager-layout/manager-layout')
        .then(m => m.ManagerLayout),

    children: [

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/manager/manager-dashboard/manager-dashboard')
            .then(m => m.ManagerDashboard),

        data: {
          title: 'Dashboard',
          subtitle: 'Construction Management',
        },
      },


      {
        path: 'materials',
        loadComponent: () =>
          import('./features/manager/materials/material-order/material-order')
            .then(m => m.MaterialOrder),

        data: {
          title: 'Materials',
          subtitle: 'Select materials and place orders',
        },
      },


      {
        path: 'orders',
        loadComponent: () =>
          import('./features/manager/orders/orders')
            .then(m => m.ManagerOrders),

        data: {
          title: 'Orders',
          subtitle: 'Track your material orders',
        },
      },
    ],
  },

  // ========================================
  // Not Found
  // ========================================

  {
    path: '**',
    redirectTo: 'login',
  },

];
