import { Component } from '@angular/core';

/**
 * FooterComponent — Rodapé institucional do Mês do Conhecimento UCS.
 *
 * Conteúdo:
 * - Logo e nome da Universidade Corporativa Senior
 * - Navegação rápida (âncoras)
 * - Copyright © 2026 Senior Sistemas
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer
      role="contentinfo"
      style="background: rgba(10,11,16,0.98); border-top: 1px solid rgba(30,41,59,0.8);"
    >
      <div class="container mx-auto px-6 py-12" style="max-width: 1200px;">

        <!-- Linha superior: Logo + Navegação -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-8"
             style="border-bottom: 1px solid rgba(30,41,59,0.6);">

          <!-- Logo + Nome -->
          <div class="flex flex-col items-center md:items-start gap-2">
            <div class="flex items-center gap-2">
              <!-- Ícone da Senior -->
              <img src="icone senior.png" alt="Senior" class="w-6 h-6 object-contain" />
              <span class="font-bold text-white">Senior</span>
              <span style="color: rgba(255,255,255,0.3);">|</span>
              <span style="color: #94a3b8; font-size: 0.875rem;">Universidade Corporativa</span>
            </div>
            <p style="color: #475569; font-size: 0.75rem;">
              Mês do Conhecimento 2026 · IA: Inteligência Ativa
            </p>
          </div>

          <!-- Navegação Rápida -->
          <nav aria-label="Navegação do rodapé" class="flex items-center gap-6">
            <a
              href="#hero"
              style="color: #94a3b8; font-size: 0.875rem; text-decoration: none; transition: color 0.3s;"
              (click)="scrollTo($event, 'hero')"
              (mouseenter)="$any($event.target).style.color = '#00b090'"
              (mouseleave)="$any($event.target).style.color = '#94a3b8'"
            >Início</a>
            <a
              href="#sobre"
              style="color: #94a3b8; font-size: 0.875rem; text-decoration: none; transition: color 0.3s;"
              (click)="scrollTo($event, 'sobre')"
              (mouseenter)="$any($event.target).style.color = '#00b090'"
              (mouseleave)="$any($event.target).style.color = '#94a3b8'"
            >Sobre</a>
            <a
              href="#palestras"
              style="color: #94a3b8; font-size: 0.875rem; text-decoration: none; transition: color 0.3s;"
              (click)="scrollTo($event, 'palestras')"
              (mouseenter)="$any($event.target).style.color = '#00b090'"
              (mouseleave)="$any($event.target).style.color = '#94a3b8'"
            >Palestras</a>
          </nav>
        </div>

        <!-- Linha inferior: Copyright -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p style="color: #475569; font-size: 0.8rem;">
            Universidade Corporativa Senior — UCS
          </p>
          <p style="color: #475569; font-size: 0.8rem;">
            © 2026 Senior Sistemas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  /** Scroll suave para seção alvo */
  scrollTo(event: MouseEvent, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
