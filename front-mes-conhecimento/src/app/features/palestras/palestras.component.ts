import { Component, inject, signal, computed } from '@angular/core';
import { LectureService } from '../../core/services/lecture.service';
import { LectureType } from '../../core/models/lecture.model';
import { LectureCardComponent } from './lecture-card/lecture-card.component';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';

/** Opções de filtro exibidas na barra de filtros */
const OPCOES_FILTRO: { label: string; value: LectureType | null }[] = [
  { label: 'Todos', value: null },
  { label: 'Palestras', value: 'PALESTRA' },
  { label: 'Oficinas', value: 'OFICINA' },
];

/**
 * PalestrasComponent — Seção principal de programação do evento.
 *
 * Ponto de Scroll Snap: #palestras (scroll-snap-align: start)
 *
 * Responsabilidades:
 * - Consome LectureService (dados via Signal)
 * - Gerencia filtro reativo por tipo (Todos | Palestra | Oficina)
 * - Renderiza grid de LectureCardComponent
 * - Exibe estado de loading e estado vazio
 *
 * State Management: 100% Signals — sem RxJS para estado interno.
 */
@Component({
  selector: 'app-palestras',
  standalone: true,
  imports: [LectureCardComponent, SectionHeaderComponent],
  template: `
    <!-- Seção Palestras — ponto de snap #palestras -->
    <section
      id="palestras"
      class="snap-section--tall py-24"
      style="background: linear-gradient(180deg, #0a0b10 0%, #0c1118 50%, #0a0b10 100%);"
      aria-labelledby="palestras-titulo"
    >
      <div class="container px-6 w-full" style="max-width: 1200px; margin: 0 auto;">

        <!-- Cabeçalho da Seção -->
        <app-section-header
          label="PROGRAMAÇÃO"
          title="Palestras do Evento"
          subtitle="Conteúdos que ampliam a visão e oficinas práticas para colocar a mão na massa — em abril, toda semana."
        />

        <!-- Barra de Filtros -->
        <div
          class="flex flex-wrap items-center justify-center gap-3 mb-12"
          role="group"
          aria-label="Filtrar palestras por tipo"
        >
          @for (opcao of opcoesFiltro; track opcao.label) {
            <button
              [id]="'filtro-' + (opcao.value ?? 'todos')"
              class="transition-all duration-300 px-6 py-2.5 rounded-full text-sm font-semibold"
              [style]="filtroAtivo() === opcao.value
                ? 'background: #00b090; color: #fff; box-shadow: 0 0 20px rgba(0,176,144,0.4);'
                : 'background: rgba(30,41,59,0.6); color: #94a3b8; border: 1px solid rgba(30,41,59,0.8);'"
              [attr.aria-pressed]="filtroAtivo() === opcao.value"
              [attr.aria-label]="'Filtrar por ' + opcao.label"
              (click)="aplicarFiltro(opcao.value)"
              (mouseenter)="onFiltroHover($event, opcao.value, true)"
              (mouseleave)="onFiltroHover($event, opcao.value, false)"
            >
              {{ opcao.label }}
              <!-- Contador de itens por filtro -->
              <span
                class="ml-2 px-2 py-0.5 rounded-full text-xs"
                [style]="filtroAtivo() === opcao.value
                  ? 'background: rgba(255,255,255,0.2); color: #fff;'
                  : 'background: rgba(0,176,144,0.15); color: #00b090;'"
              >
                {{ contarPorFiltro(opcao.value) }}
              </span>
            </button>
          }
        </div>

        <!-- Estado de Loading -->
        @if (isLoading()) {
          <div class="flex flex-col items-center justify-center py-24 gap-4" aria-live="polite">
            <div
              class="w-12 h-12 rounded-full border-2 animate-spin"
              style="border-color: rgba(0,176,144,0.2); border-top-color: #00b090;"
              aria-hidden="true"
            ></div>
            <p style="color: #64748b;">Carregando programação...</p>
          </div>
        }

        <!-- Grid de Cards -->
        @if (!isLoading() && palestrasExibidas().length > 0) {
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            [attr.aria-label]="'Lista de ' + palestrasExibidas().length + ' atividades'"
          >
            @for (item of palestrasExibidas(); track item.id; let i = $index) {
              <div
                role="listitem"
                class="animate-fade-in-up"
                [style.animation-delay]="(i * 80) + 'ms'"
              >
                <app-lecture-card [lecture]="item" />
              </div>
            }
          </div>

          <!-- Info de resultados -->
          <p
            class="text-center mt-10 text-sm"
            style="color: #475569;"
            aria-live="polite"
          >
            Exibindo
            <strong style="color: #00b090;">{{ palestrasExibidas().length }}</strong>
            de {{ lectureService.totalLectures() }} atividades
            @if (filtroAtivo()) {
              · filtrado por <strong style="color: #00b090;">{{ filtroAtivo() }}</strong>
            }
          </p>
        }

        <!-- Estado Vazio (filtro sem resultados) -->
        @if (!isLoading() && palestrasExibidas().length === 0) {
          <div
            class="flex flex-col items-center justify-center py-24 gap-4"
            aria-live="polite"
          >
            <svg class="w-16 h-16" fill="none" stroke="#1e293b" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p style="color: #475569;">Nenhuma atividade encontrada para este filtro.</p>
            <button
              class="btn-outline"
              style="padding: 0.5rem 1.5rem; font-size: 0.875rem;"
              (click)="aplicarFiltro(null)"
            >
              Ver todas
            </button>
          </div>
        }

      </div>
    </section>
  `,
})
export class PalestrasComponent {
  /** Injeção do service — fonte única de dados (mock-ready) */
  readonly lectureService = inject(LectureService);

  /** Opções da barra de filtros */
  readonly opcoesFiltro = OPCOES_FILTRO;

  /** Signal do filtro ativo (null = Todos) */
  readonly filtroAtivo = signal<LectureType | null>(null);

  /** Computed: lista de palestras filtrada reativamente */
  readonly palestrasExibidas = computed(() =>
    this.lectureService.filtrarPorTipo(this.filtroAtivo())
  );

  /** Computed: estado de loading do service */
  readonly isLoading = this.lectureService.isLoading;

  /** Aplica o filtro selecionado */
  aplicarFiltro(tipo: LectureType | null): void {
    this.filtroAtivo.set(tipo);
  }

  /** Conta itens por cada opção de filtro para exibir no badge */
  contarPorFiltro(tipo: LectureType | null): number {
    return this.lectureService.filtrarPorTipo(tipo).length;
  }

  /** Aplica efeito hover nos botões de filtro não ativos */
  onFiltroHover(event: MouseEvent, tipo: LectureType | null, hovered: boolean): void {
    if (this.filtroAtivo() === tipo) return; // Não altera o botão ativo
    const btn = event.target as HTMLElement;
    btn.style.color = hovered ? '#e2e8f0' : '#94a3b8';
    btn.style.borderColor = hovered ? 'rgba(0,176,144,0.4)' : 'rgba(30,41,59,0.8)';
  }
}
