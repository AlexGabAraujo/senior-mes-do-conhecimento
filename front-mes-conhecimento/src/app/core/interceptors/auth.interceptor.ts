import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Apenas clona e injeta cabeçalho Bearer nas requisições seguras para /api/admin
  if (token && req.url.includes('/api/admin')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Deixa o fluxo aberto passar se não for rota de admin
  return next(req);
};
