/**
 * Interface que representa uma mensagem de chat.
 * Inclui suporte a avaliações (like/dislike) e respostas aninhadas.
 */
export interface ChatMessage {
  id: number;
  lectureId: number | null;
  userId: number;
  username: string;
  content: string;
  timestamp: Date;
  likeCount: number;
  dislikeCount: number;
  usuarioJaAvaliou: boolean;
  tipoAvaliacaoUsuario: 'LIKE' | 'DISLIKE' | null;
  respostas: ChatMessage[];
}

/**
 * Estado do signal de mensagens no ChatService.
 */
export interface ChatMessageState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
