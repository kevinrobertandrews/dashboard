import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@org/feature-dashboard').then(m => m.FeatureDashboard),
  },
];
