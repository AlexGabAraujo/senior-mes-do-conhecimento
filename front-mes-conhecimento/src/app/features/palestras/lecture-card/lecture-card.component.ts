import { Component, input } from '@angular/core';
import { Lecture } from '../../../core/models/lecture.model';
import { BadgeComponent } from '../../../shared/badge/badge.component';

/**
 * LectureCardComponent — Card individual de palestra/oficina.
 *
 * Dumb component: recebe uma Lecture via @input() e renderiza o card completo.
 * Usado em: PalestrasComponent (grid de cards)
 *
 * Design fiel ao site de referência:
 * - Imagem do palestrante com overlay gradiente (topo → opaco na base)
 * - Nome em teal com ícone de pessoa
 * - Título, descrição, público-alvo
 * - Rodapé com data, horário e badge de tipo
 */
@Component({
  selector: 'app-lecture-card',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <article
      class="card-glass flex flex-col overflow-hidden h-full group"
      [attr.aria-label]="'Palestra: ' + lecture().title"
    >
      <!-- Imagem do Palestrante com Overlay Gradiente -->
      <div class="relative overflow-hidden" style="height: 220px;">
        <img
          [src]="lecture().speakerImagePath"
          [alt]="'Foto de ' + lecture().speaker"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          (error)="onImageError($event)"
        />
        <!-- Gradiente sobre a imagem (transparente no topo, escuro na base) -->
        <div
          class="absolute inset-0"
          style="background: linear-gradient(to bottom, rgba(10,11,16,0) 0%, rgba(10,11,16,0.5) 60%, rgba(10,11,16,0.95) 100%);"
          aria-hidden="true"
        ></div>

        <!-- Badge de tipo sobreposto à imagem (canto superior direito) -->
        <div class="absolute top-3 right-3">
          <app-badge [type]="lecture().type" />
        </div>
      </div>

      <!-- Conteúdo do Card -->
      <div class="flex flex-col flex-1 p-6 gap-3">

        <!-- Título da Palestra -->
        <h3
          class="font-bold leading-snug text-white"
          style="font-size: 1.05rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
        >
          {{ lecture().title }}
        </h3>

        <!-- Nome do Palestrante -->
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="#00b090" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-sm font-semibold" style="color: #00b090;">
            {{ lecture().speaker }}
          </span>
        </div>

        <!-- Descrição (limitada a 3 linhas) -->
        <p
          class="text-sm leading-relaxed flex-1"
          style="color: #94a3b8; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;"
        >
          {{ lecture().description }}
        </p>

        <!-- Público-alvo -->
        <div class="flex items-center gap-2 pt-1">
          <span class="text-xs font-semibold" style="color: #64748b;">Público-alvo:</span>
          <span class="text-xs font-medium" style="color: #cbd5e1;">{{ lecture().targetAudience }}</span>
        </div>

        <!-- Rodapé: Data, Horário e divider -->
        <div
          class="flex items-center gap-4 pt-3 mt-auto"
          style="border-top: 1px solid rgba(30, 41, 59, 0.8);"
        >
          <!-- Data -->
          <div class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="#475569" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-xs" style="color: #64748b;">{{ lecture().date }}</span>
          </div>

          <!-- Horário -->
          <div class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="#475569" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs" style="color: #64748b;">{{ lecture().time }}</span>
          </div>
        </div>
      </div>
    </article>
  `,
})
export class LectureCardComponent {
  /** Dados completos da palestra — fornecidos pelo PalestrasComponent */
  readonly lecture = input.required<Lecture>();

  /**
   * Fallback de imagem: usa um avatar genérico quando a imagem do palestrante
   * não está disponível (caminho local que não existe ainda).
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Placeholder gerado com initials do nome do palestrante
    const nome = this.lecture().speaker.split(' ')[0];
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0a0b10&color=00b090&size=400&bold=true&font-size=0.4`;
    img.onerror = null; // Previne loop infinito
  }
}
