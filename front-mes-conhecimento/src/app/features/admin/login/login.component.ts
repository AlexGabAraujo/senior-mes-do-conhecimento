import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0A0B10] p-4 text-[#E2E8F0] font-sans">
      <div class="w-full max-w-md p-8 rounded-xl border border-[#1E293B] bg-[#0F111A] shadow-2xl">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-white tracking-tight">Acesso Admin</h1>
          <p class="text-xs text-[#64748B] mt-2 tracking-wide uppercase">IA: Inteligência Ativa — Painel de Gestão</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-xs font-semibold text-[#94A3B8]">E-mail</label>
            <input
              id="email"
              type="text"
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

          @if (errorMsg()) {
            <div class="text-[#EF4444] text-xs font-medium text-center bg-[#EF4444]/10 rounded border border-[#EF4444]/20 py-2">
              {{ errorMsg() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading()"
            class="mt-2 h-10 w-full bg-[#00D28E] hover:bg-[#00B090] text-[#0A0B10] font-bold text-sm rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  #fb = inject(FormBuilder);
  #authService = inject(AuthService);
  #router = inject(Router);

  loginForm = this.#fb.nonNullable.group({
    email: ['admin', [Validators.required]],
    password: ['admin', [Validators.required]]
  });

  isLoading = signal(false);
  errorMsg = signal('');

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');

    const { email, password } = this.loginForm.getRawValue();

    this.#authService.login(email, password).subscribe({
      next: () => {
        this.#router.navigate(['/admin/palestras']);
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.message);
      }
    });
  }
}
