import { Injectable, computed, inject, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { Observable, tap, catchError, throwError, switchMap, map, of } from 'rxjs';
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
  readonly isAdmin = computed(() => this.#currentUser()?.role === UserRole.ADMIN);

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
        }),
        switchMap((res) => {
          // Após salvar o token, busca os dados do usuário
          return this.getCurrentUser().pipe(
            map(() => res), // Retorna o token original
            catchError(() => of(res)) // Se falhar ao buscar usuário, ainda retorna o token
          );
        }),
        catchError(err => throwError(() => new Error('Credenciais inválidas.')))
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`)
      .pipe(
        tap((user) => {
          this.#currentUser.set(user);
          localStorage.setItem('__user', JSON.stringify(user));
        })
      );
  }

  register(userData: { username: string; email: string; password: string }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/register`, userData)
      .pipe(
        catchError(err => throwError(() => new Error('Erro ao cadastrar usuário.')))
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
