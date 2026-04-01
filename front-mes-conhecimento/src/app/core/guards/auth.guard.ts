import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Auth Guard — Protege as rotas privadas do painel admin.
 * Verifica no AuthService se o usuário possui sessão ativa e role ADMIN.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();
  
  if (authService.isAuthenticated() && currentUser?.role === UserRole.ADMIN) {
    return true;
  }

  // Não autenticado ou não é admin: redireciona para login admin
  return router.createUrlTree(['/admin/login']);
};
