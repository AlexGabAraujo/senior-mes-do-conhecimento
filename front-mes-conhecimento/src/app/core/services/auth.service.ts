import { Injectable, computed, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { Observable, delay, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado privado gerenciado via Signal
  readonly #currentUser = signal<User | null>(null);

  // Estados públicos disponíveis para leitura (read-only)
  readonly currentUser = computed(() => this.#currentUser());
  readonly isAuthenticated = computed(() => !!this.#currentUser());

  constructor() {
    // Checa sessão local (persistência básica)
    const storedUser = localStorage.getItem('__user');
    if (storedUser) {
      try {
        this.#currentUser.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('__user');
      }
    }
  }

  /**
   * Mock simulando login. Quando conectar com a API, injetar HttpClient.
   */
  login(email: string, password: string): Observable<User> {
    // Permite "admin" ou "admin@senior.com.br" pelos prints
    if ((email === 'admin' || email === 'admin@senior.com.br') && password === 'admin') {
      const user: User = {
        id: 1,
        email: 'admin@senior.com.br',
        username: 'Admin',
        role: UserRole.ADMIN
      };

      this.#currentUser.set(user);
      localStorage.setItem('__user', JSON.stringify(user));

      // Simula uma resposta do servidor (0.5s)
      return of(user).pipe(delay(500));
    }

    // Usando string direta para simplificar a mensagem de erro da API virtual
    return throwError(() => new Error('Credenciais inválidas.')).pipe(delay(500));
  }

  logout(): void {
    this.#currentUser.set(null);
    localStorage.removeItem('__user');
  }
}
