import { Component, input, output } from '@angular/core';

/**
 * ButtonComponent — Botão reutilizável com variantes de estilo.
 *
 * Dumb component: recebe @input() e emite @output() de clique.
 * Usado em: HeroComponent (CTA "Inscreva-se")
 *
 * Exemplos de uso:
 * <app-button label="Inscreva-se" variant="primary" (clicked)="onInscrever()" />
 * <app-button label="Saiba mais" variant="outline" />
 */
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [id]="id()"
      [class]="variant() === 'primary' ? 'btn-primary' : 'btn-outline'"
      [attr.aria-label]="ariaLabel() || label()"
      [attr.type]="type()"
      (click)="clicked.emit()"
    >
      <!-- Ícone à esquerda (opcional) -->
      @if (iconLeft()) {
        <span [innerHTML]="iconLeft()"></span>
      }

      <!-- Label do botão -->
      {{ label() }}

      <!-- Ícone à direita (opcional, padrão: seta para Inscreva-se) -->
      @if (iconRight()) {
        <span [innerHTML]="iconRight()"></span>
      }
    </button>
  `,
})
export class ButtonComponent {
  /** Texto exibido no botão */
  readonly label = input.required<string>();

  /** Variante visual: 'primary' (gradiente teal) ou 'outline' (borda teal) */
  readonly variant = input<'primary' | 'outline'>('primary');

  /** Tipo HTML do botão */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  /** ID único para acessibilidade e testes */
  readonly id = input<string>('btn-action');

  /** Aria-label para acessibilidade (padrão: usa o label) */
  readonly ariaLabel = input<string>('');

  /** HTML de ícone à esquerda do texto */
  readonly iconLeft = input<string>('');

  /** HTML de ícone à direita do texto */
  readonly iconRight = input<string>('');

  /** Evento emitido ao clicar */
  readonly clicked = output<void>();
}
