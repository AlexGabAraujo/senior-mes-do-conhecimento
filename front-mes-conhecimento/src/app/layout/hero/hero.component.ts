import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/button/button.component';

/**
 * HeroComponent — Seção principal de apresentação do evento.
 *
 * Ponto de Scroll Snap: #hero (scroll-snap-align: start)
 * Ocupa 100vh — primeira "tela" que o usuário vê ao entrar no site.
 *
 * Conteúdo:
 * - Data e período do evento
 * - Título principal com gradient animado
 * - Subtítulo descritivo
 * - Botão CTA "Inscreva-se" com efeito glow
 * - Elementos decorativos de fundo
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <!-- Seção Hero — ponto de snap #hero -->
    <section
      id="hero"
      class="snap-section relative flex items-center justify-center overflow-hidden"
      style="background-color: #0a0b10;"
      aria-labelledby="hero-titulo"
    >
      <!-- Elementos decorativos de fundo e Background Image -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true" style="z-index: 0;">
        <!-- Imagem hero-bg.png com mix-blend e blur ao redor para mesclar -->
        <div class="absolute inset-0">
          <img src="hero-bg.png" alt="" class="w-full h-full object-cover opacity-50" />
          <!-- Efeito de blur/fade ao redor da imagem (Soft edges) -->
          <div class="absolute inset-0"
               style="background: radial-gradient(circle at center, transparent 30%, #0a0b10 85%); backdrop-filter: blur(2px);">
          </div>
        </div>

        <!-- Partículas/Orbs antigas agora com z-index para sobrepor parte da imagem -->
        <!-- Orb 1 - teal grande -->
        <div
          class="absolute animate-float"
          style="width: 600px; height: 600px; top: -200px; left: 50%; transform: translateX(-50%);
                 background: radial-gradient(circle, rgba(0,176,144,0.08) 0%, transparent 70%);
                 border-radius: 50%;"
        ></div>
        <!-- Orb 2 - teal pequeno à direita -->
        <div
          class="absolute animate-float"
          style="width: 300px; height: 300px; bottom: 10%; right: 5%;
                 background: radial-gradient(circle, rgba(0,151,167,0.06) 0%, transparent 70%);
                 border-radius: 50%; animation-delay: 2s;"
        ></div>
        <!-- Linha diagonal decorativa -->
        <div
          class="absolute inset-0"
          style="background: linear-gradient(135deg, transparent 40%, rgba(0,176,144,0.02) 50%, transparent 60%);"
        ></div>
        <!-- Grade de pontos sutil -->
        <div
          class="absolute inset-0 opacity-20"
          style="background-image: radial-gradient(rgba(0,176,144,0.3) 1px, transparent 1px);
                 background-size: 40px 40px;"
        ></div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="container relative z-10 flex flex-col items-center text-center px-6"
           style="max-width: 900px;">

        <!-- Identidade institucional com logo -->
        <div class="animate-fade-in-up delay-100 flex justify-center mb-6">
          <img src="logoUCS.png" alt="Senior Sistemas | Universidade Corporativa Senior" class="h-10 md:h-12 object-contain" />
        </div>

        <!-- Badge do evento -->
        <div
          class="animate-fade-in-up delay-200 inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
          style="background: rgba(0,176,144,0.1); border: 1px solid rgba(0,176,144,0.3);"
        >
          <span class="w-2 h-2 rounded-full animate-pulse" style="background: #00b090;"></span>
          <span style="color: #00b090; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;">
            Abril 2026 · Terças e Quintas
          </span>
        </div>

        <!-- Título Principal com Gradiente -->
        <h1
          id="hero-titulo"
          class="animate-fade-in-up delay-200 font-black leading-none mb-6"
          style="font-size: clamp(2.5rem, 8vw, 6rem); letter-spacing: -0.03em;"
        >
          <span
            style="background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 40%, #00b090 100%);
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                   background-clip: text; display: block;"
          >
            IA: Inteligência
          </span>
          <span
            style="background: linear-gradient(135deg, #00b090 0%, #0097a7 50%, #00b090 100%);
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                   background-clip: text; display: block;"
          >
            Ativa
          </span>
        </h1>

        <!-- Subtítulo -->
        <p
          class="animate-fade-in-up delay-300 text-base md:text-xl leading-relaxed mb-10 max-w-2xl"
          style="color: #94a3b8;"
        >
          Um mês inteiro dedicado a explorar como a
          <strong style="color: #ffffff; font-weight: 600;">Inteligência Artificial</strong>
          pode ser aplicada de forma estratégica no ambiente corporativo.
          Com <strong style="color: #00b090;">palestras</strong> que ampliam a visão e
          <strong style="color: #00b090;">oficinas</strong> práticas em abril,
          toda semana.
        </p>

        <!-- Botões de Ação -->
        <div class="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center gap-4">
          <!-- CTA Principal -->
          <a
            href="#palestras"
            id="hero-cta-principal"
            class="btn-primary animate-glow-pulse"
            style="font-size: 1rem; padding: 0.9rem 2.5rem; border-radius: 0.5rem;"
            aria-label="Ver todas as palestras do evento"
            (click)="scrollTo($event, 'palestras')"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Ver Programação
          </a>

          <!-- Botão Secundário -->
          <a
            href="#sobre"
            id="hero-cta-secundario"
            class="btn-outline"
            style="font-size: 1rem; padding: 0.9rem 2.5rem; border-radius: 0.5rem;"
            aria-label="Sobre o evento Mês do Conhecimento"
            (click)="scrollTo($event, 'sobre')"
          >
            Sobre o Evento
          </a>
        </div>

        <!-- Stats rápidos -->
        <div
          class="animate-fade-in-up delay-500 flex flex-wrap justify-center gap-8 mt-14 pt-10"
          style="border-top: 1px solid rgba(30,41,59,0.6); width: 100%;"
        >
          <div class="flex flex-col items-center gap-1">
            <span class="text-3xl font-black" style="color: #00b090;">10</span>
            <span class="text-xs font-medium uppercase tracking-widest" style="color: #475569;">Atividades</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-3xl font-black" style="color: #00b090;">4</span>
            <span class="text-xs font-medium uppercase tracking-widest" style="color: #475569;">Palestras</span>
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-3xl font-black" style="color: #00b090;">6</span>
            <span class="text-xs font-medium uppercase tracking-widest" style="color: #475569;">Oficinas</span>
          </div>
        </div>

        <!-- Indicador de scroll -->
        <div
          class="animate-float mt-10 flex flex-col items-center gap-2"
          style="color: #475569;"
          aria-hidden="true"
        >
          <span class="text-xs uppercase tracking-widest">Role para explorar</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  /** Scroll suave para seção alvo ao clicar nos CTAs */
  scrollTo(event: MouseEvent, sectionId: string): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
