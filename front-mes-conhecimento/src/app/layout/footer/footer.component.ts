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
              <!-- Ícone S da Senior -->
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2z"
                  fill="rgba(0,176,144,0.15)" stroke="#00b090" stroke-width="1.5"/>
                <path d="M9 11.5C9 10.119 10.119 9 11.5 9h2c1.381 0 2.5 1.119 2.5 2.5S14.881 14 13.5 14h-1C11.119 14 10 15.119 10 16.5S11.119 19 12.5 19h3"
                  stroke="#00b090" stroke-width="2" stroke-linecap="round"/>
              </svg>
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
