import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/section-header/section-header.component';
import { IconCardComponent } from '../../shared/icon-card/icon-card.component';

/**
 * Dado estático para os 4 pilares do evento.
 * Definido fora do componente pois são dados imutáveis de apresentação.
 */
const PILARES = [
  {
    icon: 'brain' as const,
    title: 'Inteligência Artificial',
    description:
      'Explore as tendências mais recentes em IA aplicada ao mundo corporativo e descubra como ela está redefinindo profissões e processos.',
  },
  {
    icon: 'lightbulb' as const,
    title: 'Inovação',
    description:
      'Descubra como a IA está transformando processos e criando novas oportunidades de negócio em diferentes setores da economia.',
  },
  {
    icon: 'users' as const,
    title: 'Networking',
    description:
      'Conecte-se com profissionais e especialistas da área de tecnologia que estão na vanguarda da transformação digital.',
  },
  {
    icon: 'bolt' as const,
    title: 'Prática',
    description:
      'Conteúdos hands-on para aplicar IA no seu dia a dia de trabalho. Saia de cada sessão com ferramentas e técnicas prontas para usar.',
  },
] as const;

/**
 * SobreComponent — Seção "Sobre o Evento" do Mês do Conhecimento UCS.
 *
 * Ponto de Scroll Snap: #sobre (scroll-snap-align: start)
 * Exibe:
 * - Cabeçalho com label "SOBRE O EVENTO" e título "Mês do Conhecimento 2026"
 * - Descrição do tema do ano (IA: Inteligência Ativa)
 * - Grid de 4 cards de pilares usando IconCardComponent (shared)
 */
@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [SectionHeaderComponent, IconCardComponent],
  template: `
    <!-- Seção Sobre — ponto de snap #sobre -->
    <section
      id="sobre"
      class="snap-section flex items-center justify-center py-24"
      style="background: linear-gradient(180deg, #0a0b10 0%, #0d1117 50%, #0a0b10 100%);"
      aria-labelledby="sobre-titulo"
    >
      <div class="container px-6 w-full" style="max-width: 1200px;">

        <!-- Cabeçalho da Seção reutilizável -->
        <app-section-header
          label="SOBRE O EVENTO"
          title="Mês do Conhecimento 2026"
          [subtitle]="subtituloEvento"
        />

        <!-- Destaque do Tema do Ano -->
        <div
          class="relative mb-16 p-8 md:p-10 rounded-2xl text-center overflow-hidden animate-fade-in-up"
          style="background: rgba(0,176,144,0.06);
                 border: 1px solid rgba(0,176,144,0.2);"
        >
          <!-- Brilho de fundo -->
          <div
            class="absolute inset-0 pointer-events-none"
            style="background: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(0,176,144,0.08) 0%, transparent 70%);"
            aria-hidden="true"
          ></div>

          <p
            class="relative text-base md:text-lg leading-relaxed"
            style="color: #cbd5e1; max-width: 700px; margin: 0 auto;"
          >
            A Universidade Corporativa da Senior Sistemas apresenta o
            <strong style="color: #ffffff; font-weight: 700;">IA: Inteligência Ativa</strong>
            — um mês inteiro dedicado a explorar como a Inteligência Artificial pode ser aplicada
            de forma ativa e estratégica no ambiente corporativo. Transforme inspiração em ação —
            com <strong style="color: #00b090;">palestras</strong> que ampliam a visão e
            <strong style="color: #00b090;">oficinas</strong> práticas para colocar a mão na massa,
            em abril nas <strong style="color: #ffffff;">terças e quintas</strong>.
          </p>
        </div>

        <!-- Grid de 4 Pilares usando IconCardComponent (shared) -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Pilares do evento"
        >
          @for (pilar of pilares; track pilar.title; let i = $index) {
            <div
              role="listitem"
              [class]="'delay-' + ((i + 1) * 100)"
            >
              <app-icon-card
                [icon]="pilar.icon"
                [title]="pilar.title"
                [description]="pilar.description"
              />
            </div>
          }
        </div>

        <!-- Linha decorativa inferior -->
        <div
          class="mt-16 flex items-center justify-center gap-4"
          aria-hidden="true"
        >
          <div style="height: 1px; flex: 1; background: linear-gradient(to right, transparent, rgba(0,176,144,0.3));"></div>
          <div style="width: 6px; height: 6px; background: #00b090; border-radius: 50%;"></div>
          <div style="height: 1px; flex: 1; background: linear-gradient(to left, transparent, rgba(0,176,144,0.3));"></div>
        </div>
      </div>
    </section>
  `,
})
export class SobreComponent {
  /** Pilares do evento — dados estáticos de apresentação */
  readonly pilares = PILARES;

  /** Subtítulo passado ao SectionHeaderComponent */
  readonly subtituloEvento =
    'Explorando a Inteligência Artificial de forma estratégica e prática no ambiente corporativo.';
}
