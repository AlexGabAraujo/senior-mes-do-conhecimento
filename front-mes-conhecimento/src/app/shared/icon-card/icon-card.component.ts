import { Component, input } from '@angular/core';

/**
 * IconCardComponent — Card reutilizável com ícone SVG, título e descrição.
 *
 * Correção: ícones SVG renderizados diretamente via @switch no template
 * (evita sanitização Angular que bloqueava [innerHTML] com SVG).
 *
 * Dumb component: recebe apenas @input() e renderiza o card.
 * Usado em: SobreComponent (4 pilares do evento)
 */
@Component({
  selector: 'app-icon-card',
  standalone: true,
  template: `
    <div class="card-glass flex flex-col items-center text-center p-8 gap-4">
      <!-- Ícone com fundo teal iluminado -->
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
        style="background: rgba(0, 176, 144, 0.15); border: 1px solid rgba(0, 176, 144, 0.3);"
      >
        <!-- Ícone: Cérebro (Inteligência Artificial) -->
        @if (icon() === 'brain') {
          <svg width="32" height="32" fill="none" stroke="#00b090" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        }

        <!-- Ícone: Lâmpada (Inovação) -->
        @if (icon() === 'lightbulb') {
          <svg width="32" height="32" fill="none" stroke="#00b090" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 2a7 7 0 017 7c0 2.76-1.58 5.15-3.9 6.37L15 17H9l-.1-1.63A7.001 7.001 0 015 9a7 7 0 017-7zM9 21h6m-6-2h6"/>
          </svg>
        }

        <!-- Ícone: Pessoas (Networking) -->
        @if (icon() === 'users') {
          <svg width="32" height="32" fill="none" stroke="#00b090" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        }

        <!-- Ícone: Raio (Prática) -->
        @if (icon() === 'bolt') {
          <svg width="32" height="32" fill="none" stroke="#00b090" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        }
      </div>

      <!-- Título -->
      <h3 class="text-lg font-bold text-white">{{ title() }}</h3>

      <!-- Descrição -->
      <p class="text-sm leading-relaxed" style="color: #94a3b8;">{{ description() }}</p>
    </div>
  `,
})
export class IconCardComponent {
  /**
   * Nome do ícone a ser exibido.
   * Valores aceitos: 'brain' | 'lightbulb' | 'users' | 'bolt'
   */
  readonly icon = input.required<'brain' | 'lightbulb' | 'users' | 'bolt'>();

  /** Título do card */
  readonly title = input.required<string>();

  /** Texto descritivo do card */
  readonly description = input.required<string>();
}
