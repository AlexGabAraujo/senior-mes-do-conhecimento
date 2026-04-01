/**
 * Modelos de domínio para as Palestras do Mês do Conhecimento UCS.
 *
 * Estrutura pensada para ser Mock-Ready:
 * o LectureService pode substituir o array interno por HttpClient.get<Lecture[]>()
 * sem que nenhum componente consumidor precise ser alterado.
 */

/**
 * Tipo de atividade da programação.
 * - Palestra: apresentação expositiva para o público geral
 * - Oficina: atividade prática e hands-on
 */
export type LectureType = 'PALESTRA' | 'OFICINA';

/**
 * Público-alvo da palestra/oficina.
 */
export type TargetAudience = 'TODOS' | 'DEVS' | 'GESTORES' | 'RH' | 'NEGOCIOS';

/**
 * Interface principal que representa uma Palestra ou Oficina do evento.
 *
 * Campos projetados para substituição futura por dados da API:
 * - `speakerImagePath` → será um path do servidor: `/assets/images/lectures/{slug}.jpg`
 * - `registrationUrl` → link externo de inscrição (ex: Google Forms / plataforma interna)
 */
export interface Lecture {
  /** Identificador único da palestra */
  id: number;

  /** Título completo da palestra ou oficina */
  title: string;

  /** Nome(s) do(s) palestrante(s) */
  speaker: string;

  /** Descrição detalhada do conteúdo */
  description: string;

  /** Público-alvo da atividade */
  targetAudience: TargetAudience;

  /** Data da atividade (alinhado com LocalDate no back) */
  date: Date;

  /** Horário de início (ex: "10:00") */
  time: string;

  /** Tipo da atividade: Palestra ou Oficina */
  type: LectureType;

  /**
   * Caminho da imagem do palestrante.
   * Convenção: /assets/images/lectures/{slug-do-palestrante}.jpg
   * Enquanto não houver imagens reais, usar placeholder com slug descritivo.
   */
  speakerImagePath: string;

  /** URL de inscrição — opcional, habilitado para uso futuro */
  registrationUrl?: string;

  /** Indica se a palestra já foi finalizada */
  finished: boolean;
}

/**
 * Interface para o estado interno do LectureService.
 * Encapsula os dados e metadados de carregamento.
 * Facilita a migração futura para chamadas HTTP assíncronas.
 */
export interface LectureState {
  lectures: Lecture[];
  isLoading: boolean;
  error: string | null;
}
