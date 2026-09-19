import { Routes } from '@angular/router';

import { SiteList } from './site-list/site-list';
import { SiteForm } from './site-form/site-form';

export const SITE_ROUTES: Routes = [

  {
    path: '',
    component: SiteList,
    data: {
      title: 'Sites',
      subtitle: 'Manage construction sites'
    }
  },

  {
    path: 'create',
    component: SiteForm,
    data: {
      title: 'Create Site',
      subtitle: 'Add a new construction site'
    }
  },

  {
    path: ':id/edit',
    component: SiteForm,
    data: {
      title: 'Edit Site',
      subtitle: 'Update site details'
    }
  }

];
