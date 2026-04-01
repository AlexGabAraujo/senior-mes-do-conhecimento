import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0A0B10] p-4 text-[#E2E8F0] font-sans">
      <div class="w-full max-w-md p-8 rounded-xl border border-[#1E293B] bg-[#0F111A] shadow-2xl">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-white tracking-tight">Cadastro</h1>
          <p class="text-xs text-[#64748B] mt-2 tracking-wide uppercase">IA: Inteligência Ativa — Criar Conta</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="username" class="text-xs font-semibold text-[#94A3B8]">Nome de Usuário</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="h-10 px-3 py-2 bg-[#1E293B]/50 border border-[#334155] rounded-md text-sm text-white focus:outline-none focus:border-[#00B090] focus:ring-1 focus:ring-[#00B090] transition-colors"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="text-xs font-semibold text-[#94A3B8]">E-mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="h-10 px-3 py-2 bg-[#1E293B]/50 border border-[#334155] rounded-md text-sm text-white focus:outline-none focus:border-[#00B090] focus:ring-1 focus:ring-[#00B090] transition-colors"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="text-xs font-semibold text-[#94A3B8]">Senha</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="h-10 px-3 py-2 bg-[#1E293B]/50 border border-[#334155] rounded-md text-sm text-white focus:outline-none focus:border-[#00B090] focus:ring-1 focus:ring-[#00B090] transition-colors"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="text-xs font-semibold text-[#94A3B8]">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="h-10 px-3 py-2 bg-[#1E293B]/50 border border-[#334155] rounded-md text-sm text-white focus:outline-none focus:border-[#00B090] focus:ring-1 focus:ring-[#00B090] transition-colors"
            />
          </div>

          @if (errorMessage()) {
            <div class="text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-md p-3">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading()"
            class="h-10 bg-[#00B090] hover:bg-[#00A085] disabled:bg-[#334155] disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors duration-200 text-sm tracking-wide"
          >
            @if (isLoading()) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cadastrando...
              </span>
            } @else {
              Cadastrar
            }
          </button>

          <div class="text-center">
            <p class="text-xs text-[#64748B]">
              Já tem uma conta?
              <a routerLink="/login" class="text-[#00B090] hover:text-[#00A085] transition-colors ml-1">
                Fazer login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) return;

    const { username, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('As senhas não coincidem');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register({
      username: username!,
      email: email!,
      password: password!
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        this.errorMessage.set(error.message || 'Erro ao cadastrar usuário');
        this.isLoading.set(false);
      }
    });
  }
}