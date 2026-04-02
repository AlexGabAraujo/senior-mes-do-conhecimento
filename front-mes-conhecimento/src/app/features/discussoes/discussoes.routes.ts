import { Routes } from '@angular/router';
import { userAuthGuard } from '../../core/guards/user-auth.guard';

export const discussoesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./discussoes.component').then(m => m.DiscussoesComponent),
    canActivate: [userAuthGuard],
  },
];
