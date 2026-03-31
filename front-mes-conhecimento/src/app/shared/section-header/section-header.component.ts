import { Component, input } from '@angular/core';

/**
 * SectionHeaderComponent — Cabeçalho padronizado para seções da página.
 *
 * Dumb component: renderiza o label superior (ex: "PROGRAMAÇÃO") e o título principal.
 * Usado em: SobreComponent, PalestrasComponent
 *
 * Exemplo de uso:
 * <app-section-header
 *   label="PROGRAMAÇÃO"
 *   title="Palestras do Evento"
 * />
 */
@Component({
  selector: 'app-section-header',
  standalone: true,
  template: `
    <div class="flex flex-col items-center text-center mb-12">
      <!-- Label superior em teal com letra-espaçamento -->
      <span class="section-label">{{ label() }}</span>

      <!-- Linha decorativa teal -->
      <span class="accent-line mb-4"></span>

      <!-- Título principal -->
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {{ title() }}
      </h2>

      <!-- Subtítulo opcional -->
      @if (subtitle()) {
        <p class="text-senior-muted text-base md:text-lg mt-4 max-w-2xl leading-relaxed">
          {{ subtitle() }}
        </p>
      }
    </div>
  `,
})
export class SectionHeaderComponent {
  /** Label pequeno em maiúsculas acima do título (ex: "PROGRAMAÇÃO") */
  readonly label = input.required<string>();

  /** Título principal da seção */
  readonly title = input.required<string>();

  /** Subtítulo opcional abaixo do título */
  readonly subtitle = input<string>('');
}
