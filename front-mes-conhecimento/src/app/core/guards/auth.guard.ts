import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard — Protege as rotas privadas do painel admin.
 * Verifica no AuthService se o usuário possui sessão ativa.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Não autenticado: redireciona enviando de volta para a tela de login
  return router.createUrlTree(['/admin/login']);
};
