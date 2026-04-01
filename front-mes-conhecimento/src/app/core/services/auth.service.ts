import { Injectable, computed, inject, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  // State local
  readonly #currentUser = signal<User | null>(null);

  // States derivados
  readonly currentUser = computed(() => this.#currentUser());
  readonly isAuthenticated = computed(() => !!this.#currentUser());

  constructor() {
    this.checkSession();
  }

  // Analisa o token no localStorage para reidratar o login ao dar f5
  private checkSession() {
    const token = localStorage.getItem('__auth_token');
    const storedUser = localStorage.getItem('__user');
    
    if (token && storedUser) {
      try {
        this.#currentUser.set(JSON.parse(storedUser));
      } catch {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('__auth_token', res.token);
          
          // Num cenário real teríamos uma requisição /api/me ou decode de JWT (jwt-decode).
          // Para este protótipo, vamos instanciar o objeto usuário base para liberar as VIEWS de admin:
          const user: User = {
            id: 0,
            email: email,
            username: 'Admin Mês Conhecimento',
            role: UserRole.ADMIN
          };

          this.#currentUser.set(user);
          localStorage.setItem('__user', JSON.stringify(user));
        }),
        catchError(err => throwError(() => new Error('Credenciais inválidas.')))
      );
  }

  logout(): void {
    this.#currentUser.set(null);
    localStorage.removeItem('__user');
    localStorage.removeItem('__auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('__auth_token');
  }
}
