import { Routes } from '@angular/router';

import { MaterialList } from './material-list/material-list';
import { MaterialForm } from './material-form/material-form';

export const MATERIAL_ROUTES: Routes = [
  {
    path: '',
    component: MaterialList,
  },
  {
    path: 'create',
    component: MaterialForm,
  },
];
