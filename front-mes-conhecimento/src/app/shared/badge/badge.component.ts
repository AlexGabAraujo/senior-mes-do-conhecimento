import { Component, input } from '@angular/core';
import { LectureType } from '../../core/models/lecture.model';

/**
 * BadgeComponent — Componente reutilizável de badge de tipo de atividade.
 *
 * Dumb component: recebe apenas @input() e renderiza o badge correto.
 * Usado em: LectureCardComponent
 *
 * Exemplos de uso:
 * <app-badge [type]="'PALESTRA'" />
 * <app-badge [type]="'OFICINA'" />
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span
      class="badge"
      [class.badge--palestra]="type() === 'PALESTRA'"
      [class.badge--oficina]="type() === 'OFICINA'"
      [attr.aria-label]="'Tipo: ' + type()"
    >
      @if (type() === 'PALESTRA') {
        <svg class="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      } @else {
        <svg class="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      }
      {{ type() }}
    </span>
  `,
})
export class BadgeComponent {
  /** Tipo da atividade — determina cor e ícone do badge */
  readonly type = input.required<LectureType>();
}
