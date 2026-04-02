import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChatMessage, ChatMessageState } from '../models/chat-message.model';
import { ChatRoom } from '../models/chat-room.model';

interface RoomState {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  isLoading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/chat';

  readonly #messageState = signal<ChatMessageState>({ messages: [], isLoading: false, error: null });
  readonly #roomState = signal<RoomState>({ rooms: [], selectedRoom: null, isLoading: false, error: null });

  readonly messages = computed(() => this.#messageState().messages);
  readonly isLoadingMessages = computed(() => this.#messageState().isLoading);
  readonly rooms = computed(() => this.#roomState().rooms);
  readonly selectedRoom = computed(() => this.#roomState().selectedRoom);
  readonly isLoadingRooms = computed(() => this.#roomState().isLoading);

  carregarRooms(): void {
    this.#roomState.update(s => ({ ...s, isLoading: true }));

    this.http.get<ChatRoom[]>(`${this.baseUrl}/rooms`).subscribe({
      next: (rooms) => {
        const parsed = rooms.map(r => ({
          ...r,
          lectureDate: r.lectureDate ? new Date(r.lectureDate) : null
        }));

        this.#roomState.set({ rooms: parsed, selectedRoom: parsed[0] ?? null, isLoading: false, error: null });

        // Carrega mensagens do Chat Geral por padrão
        if (parsed[0]) this.#carregarMensagens(parsed[0]);
      },
      error: () => this.#roomState.update(s => ({ ...s, isLoading: false, error: 'Erro ao carregar chats' }))
    });
  }

  selecionarRoom(room: ChatRoom): void {
    this.#roomState.update(s => ({ ...s, selectedRoom: room }));
    this.#carregarMensagens(room);
  }

  #carregarMensagens(room: ChatRoom): void {
    this.#messageState.update(s => ({ ...s, isLoading: true }));

    const url = room.isGeneral
      ? `${this.baseUrl}/messages/general`
      : `${this.baseUrl}/messages`;

    const options = room.isGeneral
      ? {}
      : { params: new HttpParams().set('lectureId', room.lectureId!.toString()) };

    this.http.get<ChatMessage[]>(url, options).subscribe({
      next: (msgs) => {
        const parsed = msgs.map(m => this.#parseMensagem(m));
        this.#messageState.set({ messages: parsed, isLoading: false, error: null });
      },
      error: () => this.#messageState.update(s => ({ ...s, isLoading: false, error: 'Erro ao carregar mensagens' }))
    });
  }

  enviarMensagem(content: string): void {
    const room = this.#roomState().selectedRoom;
    if (!room) return;

    this.http.post<ChatMessage>(`${this.baseUrl}/messages`, {
      lectureId: room.lectureId,
      content
    }).subscribe({
      next: (msg) => {
        const nova = this.#parseMensagem(msg);
        this.#messageState.update(s => ({ ...s, messages: [...s.messages, nova] }));
      },
      error: (err) => console.error('Erro ao enviar mensagem:', err)
    });
  }

  /**
   * Envia uma avaliação (LIKE ou DISLIKE) para uma mensagem.
   * Atualiza os contadores e o estado de avaliação do usuário no signal.
   */
  avaliarMensagem(mensagemId: number, tipo: 'LIKE' | 'DISLIKE'): void {
    this.http.post<ChatMessage>(`${this.baseUrl}/messages/${mensagemId}/avaliar`, { tipo }).subscribe({
      next: (atualizada) => {
        this.#messageState.update(s => ({
          ...s,
          messages: s.messages.map(m => this.#atualizarMensagemAvaliada(m, mensagemId, atualizada))
        }));
      },
      error: (err) => console.error('Erro ao avaliar mensagem:', err)
    });
  }

  /**
   * Envia uma resposta a uma mensagem pai.
   * Adiciona a nova resposta ao array `respostas` da mensagem pai no signal.
   */
  responderMensagem(mensagemPaiId: number, content: string): void {
    this.http.post<ChatMessage>(`${this.baseUrl}/messages/${mensagemPaiId}/responder`, { content }).subscribe({
      next: (resposta) => {
        const novaResposta = this.#parseMensagem(resposta);
        this.#messageState.update(s => ({
          ...s,
          messages: s.messages.map(m => {
            if (m.id !== mensagemPaiId) return m;
            // Adiciona a nova resposta ao array de respostas da mensagem pai (imutável)
            return { ...m, respostas: [...m.respostas, novaResposta] };
          })
        }));
      },
      error: (err) => console.error('Erro ao responder mensagem:', err)
    });
  }

  /**
   * Parseia os campos de data de uma mensagem e suas respostas.
   */
  #parseMensagem(m: ChatMessage): ChatMessage {
    return {
      ...m,
      timestamp: new Date(m.timestamp),
      respostas: (m.respostas ?? []).map(r => this.#parseMensagem(r))
    };
  }

  /**
   * Atualiza os dados de avaliação de uma mensagem (ou de uma resposta aninhada) pelo id.
   * Retorna um novo objeto para garantir imutabilidade.
   */
  #atualizarMensagemAvaliada(mensagem: ChatMessage, id: number, atualizada: ChatMessage): ChatMessage {
    if (mensagem.id === id) {
      return {
        ...mensagem,
        likeCount: atualizada.likeCount,
        dislikeCount: atualizada.dislikeCount,
        usuarioJaAvaliou: atualizada.usuarioJaAvaliou,
        tipoAvaliacaoUsuario: atualizada.tipoAvaliacaoUsuario
      };
    }

    // Verifica também nas respostas aninhadas
    const respostasAtualizadas = mensagem.respostas.map(r =>
      this.#atualizarMensagemAvaliada(r, id, atualizada)
    );

    // Evita criar novo objeto se nada mudou nas respostas
    const respostasMudaram = respostasAtualizadas.some((r, i) => r !== mensagem.respostas[i]);
    if (!respostasMudaram) return mensagem;

    return { ...mensagem, respostas: respostasAtualizadas };
  }
}
