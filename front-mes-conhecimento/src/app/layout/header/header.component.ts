import { Component, signal, HostListener } from '@angular/core';

/**
 * HeaderComponent — Navbar principal do site Mês do Conhecimento UCS.
 *
 * Comportamento:
 * - Sticky no topo com backdrop blur ao rolar a página
 * - Logo SVG da Senior Universidade Corporativa à esquerda
 * - Menu de navegação (Palestras | Sobre) à direita com scroll suave
 * - Menu hamburger responsivo em mobile
 */
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      [class.scrolled]="isScrolled()"
      [style]="isScrolled()
        ? 'background: rgba(10,11,16,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(30,41,59,0.8); box-shadow: 0 4px 24px rgba(0,0,0,0.4);'
        : 'background: transparent;'"
      role="banner"
    >
      <div class="container mx-auto px-6 h-16 flex items-center justify-between" style="max-width: 1200px;">

        <!-- Logo Senior Universidade Corporativa -->
        <a
          href="#hero"
          class="flex items-center gap-2 no-underline group"
          aria-label="Ir para o início — Senior Universidade Corporativa"
          (click)="scrollTo($event, 'hero')"
        >
          <!-- Logo UCS — imagem real -->
          <img
            src="/logoUCS.png"
            alt="Senior Universidade Corporativa"
            class="h-8 md:h-9 object-contain transition-transform duration-300 group-hover:scale-105"
            style="filter: brightness(0) invert(1);"
          />
        </a>

        <!-- Navegação Desktop -->
        <nav
          class="hidden md:flex items-center gap-8"
          role="navigation"
          aria-label="Navegação principal"
        >
          <a
            href="#palestras"
            id="nav-palestras"
            class="nav-link"
            style="color: #94a3b8; font-size: 0.9rem; font-weight: 500; text-decoration: none; transition: color 0.3s ease; letter-spacing: 0.02em;"
            (click)="scrollTo($event, 'palestras')"
            (mouseenter)="onNavHover($event, true)"
            (mouseleave)="onNavHover($event, false)"
          >
            Palestras
          </a>
          <a
            href="#sobre"
            id="nav-sobre"
            class="nav-link"
            style="color: #94a3b8; font-size: 0.9rem; font-weight: 500; text-decoration: none; transition: color 0.3s ease; letter-spacing: 0.02em;"
            (click)="scrollTo($event, 'sobre')"
            (mouseenter)="onNavHover($event, true)"
            (mouseleave)="onNavHover($event, false)"
          >
            Sobre
          </a>

          <!-- Botão CTA no Header -->
          <a
            href="#palestras"
            id="nav-inscreva-se"
            class="btn-primary"
            style="padding: 0.5rem 1.25rem; font-size: 0.875rem; border-radius: 0.375rem;"
            (click)="scrollTo($event, 'palestras')"
            aria-label="Inscreva-se nas palestras"
          >
            Inscreva-se
          </a>
        </nav>

        <!-- Menu Hamburger Mobile -->
        <button
          id="btn-menu-mobile"
          class="md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-all duration-300"
          style="color: #94a3b8;"
          [attr.aria-expanded]="mobileMenuOpen()"
          aria-label="Abrir menu de navegação"
          (click)="toggleMobileMenu()"
        >
          <span
            class="block w-5 h-0.5 transition-all duration-300 origin-center"
            style="background: #94a3b8;"
            [style.transform]="mobileMenuOpen() ? 'rotate(45deg) translateY(8px)' : 'none'"
          ></span>
          <span
            class="block w-5 h-0.5 transition-all duration-300"
            style="background: #94a3b8;"
            [style.opacity]="mobileMenuOpen() ? '0' : '1'"
          ></span>
          <span
            class="block w-5 h-0.5 transition-all duration-300 origin-center"
            style="background: #94a3b8;"
            [style.transform]="mobileMenuOpen() ? 'rotate(-45deg) translateY(-8px)' : 'none'"
          ></span>
        </button>
      </div>

      <!-- Menu Mobile Expandido -->
      @if (mobileMenuOpen()) {
        <div
          class="md:hidden animate-fade-in"
          style="background: rgba(10,11,16,0.98); border-top: 1px solid rgba(30,41,59,0.8); padding: 1rem 1.5rem;"
          role="navigation"
          aria-label="Menu mobile"
        >
          <div class="flex flex-col gap-4">
            <a
              href="#palestras"
              style="color: #94a3b8; font-size: 1rem; font-weight: 500; text-decoration: none; padding: 0.5rem 0;"
              (click)="scrollTo($event, 'palestras'); toggleMobileMenu()"
            >
              Palestras
            </a>
            <a
              href="#sobre"
              style="color: #94a3b8; font-size: 1rem; font-weight: 500; text-decoration: none; padding: 0.5rem 0;"
              (click)="scrollTo($event, 'sobre'); toggleMobileMenu()"
            >
              Sobre
            </a>
            <a
              href="#palestras"
              class="btn-primary"
              style="text-align: center; border-radius: 0.375rem;"
              (click)="scrollTo($event, 'palestras'); toggleMobileMenu()"
            >
              Inscreva-se
            </a>
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  /** Signal: controla se a página foi rolada (ativa o efeito blur no header) */
  readonly isScrolled = signal(false);

  /** Signal: controla abertura/fechamento do menu mobile */
  readonly mobileMenuOpen = signal(false);

  /** Detecta scroll da página para aplicar efeito blur no header */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  /** Abre/fecha o menu mobile */
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  /** Aplica hover style nos links de navegação */
  onNavHover(event: MouseEvent, hovered: boolean): void {
    const link = event.target as HTMLElement;
    link.style.color = hovered ? '#00b090' : '#94a3b8';
  }

  /**
   * Realiza scroll suave para a seção alvo.
   * Funciona em conjunto com scroll-snap — navega para a âncora correta.
   */
  scrollTo(event: MouseEvent, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
