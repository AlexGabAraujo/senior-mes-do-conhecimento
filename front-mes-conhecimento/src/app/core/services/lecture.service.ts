import { Injectable, signal, computed } from '@angular/core';
import { Lecture, LectureState, LectureType } from '../models/lecture.model';

/**
 * LectureService — Serviço de Palestras do Mês do Conhecimento UCS.
 *
 * Arquitetura Mock-Ready:
 * Os dados atualmente são mockados neste service.
 * Para migrar para a API real, basta:
 *   1. Injetar HttpClient no construtor
 *   2. Substituir `this.#carregarMocks()` por:
 *      `this.http.get<Lecture[]>('/api/palestras').subscribe(data => this.#state.set({ lectures: data, isLoading: false, error: null }))`
 *   3. Nenhum componente consumidor precisa ser alterado.
 *
 * State Management: Angular Signals (sem RxJS para estado interno)
 */
@Injectable({
  providedIn: 'root',
})
export class LectureService {

  /** Estado privado encapsulado — não exposto diretamente aos componentes */
  readonly #state = signal<LectureState>({
    lectures: [],
    isLoading: true,
    error: null,
  });

  // ─── Signals públicos derivados (read-only para os componentes) ───────────

  /** Lista completa de palestras */
  readonly lectures = computed(() => this.#state().lectures);

  /** Indica se os dados estão sendo carregados */
  readonly isLoading = computed(() => this.#state().isLoading);

  /** Mensagem de erro, caso ocorra */
  readonly error = computed(() => this.#state().error);

  /** Total de palestras cadastradas */
  readonly totalLectures = computed(() => this.lectures().length);

  /** Total de palestras por tipo */
  readonly totalPalestras = computed(
    () => this.lectures().filter(l => l.type === 'Palestra').length
  );

  readonly totalOficinas = computed(
    () => this.lectures().filter(l => l.type === 'Oficina').length
  );

  constructor() {
    // Simula carregamento assíncrono — comportamento idêntico ao que será com HTTP
    this.#carregarMocks();
  }

  // ─── Métodos Públicos ─────────────────────────────────────────────────────

  /**
   * Retorna palestras filtradas por tipo.
   * Computed signal derivado do filtro selecionado.
   *
   * @param tipo - 'Palestra' | 'Oficina' | null (null = todos)
   */
  filtrarPorTipo(tipo: LectureType | null): Lecture[] {
    if (!tipo) return this.lectures();
    return this.lectures().filter(l => l.type === tipo);
  }

  // ─── Carregamento de Dados (Mock) ─────────────────────────────────────────

  /**
   * Carrega os dados mockados de palestras.
   *
   * PONTO DE SUBSTITUIÇÃO FUTURA:
   * Substituir o conteúdo deste método por uma chamada HTTP:
   * ```typescript
   * private carregarDados(): void {
   *   this.http.get<Lecture[]>('/api/palestras').subscribe({
   *     next: (data) => this.#state.set({ lectures: data, isLoading: false, error: null }),
   *     error: (err) => this.#state.set({ lectures: [], isLoading: false, error: err.message }),
   *   });
   * }
   * ```
   */
  #carregarMocks(): void {
    const mocksPalestras: Lecture[] = [
      {
        id: 1,
        title: 'O Profissional da IA',
        speaker: 'Leonardo Loureiro',
        description:
          'Não estamos vivendo uma era de mudanças, mas uma mudança de era. A Inteligência Artificial não é apenas uma evolução tecnológica; é uma revolução que exige um novo tipo de talento: o Profissional da IA.',
        targetAudience: 'Todos',
        date: '02 de abril',
        time: '10:00',
        type: 'Palestra',
        speakerImagePath: '/assets/images/lectures/leonardo-loureiro.jpg',
        registrationUrl: '#',
      },
      {
        id: 2,
        title: 'AWS Kiro na Prática: Explore, Personalize e Acelere com IA',
        speaker: 'Cesar Kuehl',
        description:
          'Nesta sessão, você vai conhecer o Kiro, a IDE com IA da AWS que está transformando a forma como desenvolvedores escrevem, revisam e entregam código.',
        targetAudience: 'Devs',
        date: '07 de abril',
        time: '10:00',
        type: 'Oficina',
        speakerImagePath: '/assets/images/lectures/cesar-kuehl.jpg',
        registrationUrl: '#',
      },
      {
        id: 3,
        title: 'Inovação na era da IA: propriedade intelectual ou pensamento artificial',
        speaker: 'Taiolor Morais',
        description:
          'A Inteligência Artificial está redefinindo as fronteiras do que consideramos "criação". Em um mundo onde algoritmos podem gerar resultados em segundos, onde fica o valor da nossa originalidade?',
        targetAudience: 'Todos',
        date: '07 de abril',
        time: '16:00',
        type: 'Palestra',
        speakerImagePath: '/assets/images/lectures/taiolor-morais.jpg',
        registrationUrl: '#',
      },
      {
        id: 4,
        title: 'Copilot Chat: IA para Conversas Estratégicas',
        speaker: 'Eduardo Estanislau',
        description:
          'Aprenda a usar o Microsoft Copilot Chat como um assistente estratégico no seu dia a dia corporativo, potencializando reuniões, análises e tomadas de decisão com IA.',
        targetAudience: 'Todos',
        date: '09 de abril',
        time: '10:00',
        type: 'Oficina',
        speakerImagePath: '/assets/images/lectures/eduardo-estanislau.jpg',
        registrationUrl: '#',
      },
      {
        id: 5,
        title: 'Construindo com IA: Do Prompt ao Produto',
        speaker: 'Matheus Fratz',
        description:
          'Descubra como transformar ideias em produtos funcionais utilizando ferramentas de IA generativa. Uma jornada prática do conceito ao MVP com apoio de IA.',
        targetAudience: 'Devs',
        date: '09 de abril',
        time: '14:00',
        type: 'Oficina',
        speakerImagePath: '/assets/images/lectures/matheus-fratz.jpg',
        registrationUrl: '#',
      },
      {
        id: 6,
        title: 'Squads Cognitivos: Times Aumentados por IA',
        speaker: 'Leandro Dalcin & Everton Bortolini',
        description:
          'Como estruturar equipes de alto desempenho que utilizam IA como membro ativo do squad? Explore o conceito de squads cognitivos e o futuro do trabalho colaborativo com IA.',
        targetAudience: 'Gestores',
        date: '14 de abril',
        time: '10:00',
        type: 'Palestra',
        speakerImagePath: '/assets/images/lectures/leandro-everton.jpg',
        registrationUrl: '#',
      },
      {
        id: 7,
        title: 'Sara Studio: Criando Conteúdo com IA Generativa',
        speaker: 'Tharlys Dias',
        description:
          'Conheça o Sara Studio e aprenda a criar conteúdos de treinamento, apresentações e materiais corporativos com auxílio de IA generativa de forma rápida e profissional.',
        targetAudience: 'Todos',
        date: '14 de abril',
        time: '14:00',
        type: 'Oficina',
        speakerImagePath: '/assets/images/lectures/tharlys-dias.jpg',
        registrationUrl: '#',
      },
      {
        id: 8,
        title: 'Agentes de IA e n8n no Dia a Dia Corporativo',
        speaker: 'Michel Nienow',
        description:
          'Automatize fluxos de trabalho complexos com agentes de IA e n8n. Aprenda a criar automações inteligentes que conectam sistemas, tomam decisões e executam tarefas de forma autônoma.',
        targetAudience: 'Devs',
        date: '16 de abril',
        time: '10:00',
        type: 'Oficina',
        speakerImagePath: '/assets/images/lectures/michel-nienow.jpg',
        registrationUrl: '#',
      },
      {
        id: 9,
        title: 'Copilot 365 Full: Produtividade Máxima com IA',
        speaker: 'Eduardo Estanislau',
        description:
          'Uma imersão completa no ecossistema Microsoft 365 Copilot. Teams, Word, Excel, PowerPoint e Outlook potencializados por IA para transformar sua produtividade diária.',
        targetAudience: 'Todos',
        date: '16 de abril',
        time: '14:00',
        type: 'Oficina',
        speakerImagePath: '/assets/images/lectures/eduardo-estanislau-2.jpg',
        registrationUrl: '#',
      },
      {
        id: 10,
        title: 'A Próxima Fase da IA: O que Vem Depois do Hype',
        speaker: 'José Luckmann',
        description:
          'Uma análise profunda sobre o futuro da Inteligência Artificial para além das tendências atuais: AGI, IA corporativa de nova geração e como as organizações devem se preparar.',
        targetAudience: 'Todos',
        date: '23 de abril',
        time: '10:00',
        type: 'Palestra',
        speakerImagePath: '/assets/images/lectures/jose-luckmann.jpg',
        registrationUrl: '#',
      },
    ];

    // Simula latência de rede (será substituído pela chamada HTTP real)
    setTimeout(() => {
      this.#state.set({
        lectures: mocksPalestras,
        isLoading: false,
        error: null,
      });
    }, 300);
  }
}
