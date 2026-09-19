import { Routes } from '@angular/router';

import { ManagersList } from './managers-list/managers-list';
import { ManagerForm } from './manager-form/manager-form';

export const MANAGER_ROUTES: Routes = [

  {
    path: '',
    component: ManagersList,
    data: {
      title: 'Managers',
      subtitle: 'Manage site managers'
    }
  },

  {
    path: 'create',
    component: ManagerForm,
    data: {
      title: 'Create Manager',
      subtitle: 'Add a new site manager'
    }
  },

  {
    path: ':id/edit',
    component: ManagerForm,
    data: {
      title: 'Edit Manager',
      subtitle: 'Update manager details'
    }
  }

];
