import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-[#0A0B10] text-[#E2E8F0] flex flex-col font-sans">
      <header class="h-16 border-b border-[#1E293B] bg-[#0A0B10]/80 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-50">
        <div class="flex items-center gap-4">
          <span class="font-bold text-lg tracking-tight" style="color: #00B090;">
            Senior <span class="text-white font-normal">Admin</span>
          </span>
          <nav class="hidden md:flex ml-8 gap-4">
            <a routerLink="/admin/palestras" routerLinkActive="text-[#00B090]" class="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors">Palestras</a>
          </nav>
        </div>
        <button (click)="logout()" class="text-sm font-medium text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer">Sair</button>
      </header>
      <main class="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayoutComponent {
  #authService = inject(AuthService);
  #router = inject(Router);

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/admin/login']);
  }
}
