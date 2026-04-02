import { Component, ElementRef, effect, inject, input, signal, viewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chat-messages',
  standalone: true,
  imports: [DatePipe, NgClass],
  template: `
    <div
      #scrollContainer
      class="flex flex-col gap-3 p-6 overflow-y-auto h-full"
      role="log"
      aria-live="polite"
      aria-label="Histórico de mensagens"
    >
      @if (isLoading()) {
        <div class="flex items-center justify-center h-full">
          <span class="text-slate-500 text-sm">Carregando mensagens...</span>
        </div>
      } @else if (messages().length === 0) {
        <div class="flex items-center justify-center h-full">
          <span class="text-slate-500 text-sm">Nenhuma mensagem ainda. Seja o primeiro a comentar!</span>
        </div>
      } @else {
        @for (msg of messages(); track msg.id) {
          <div class="flex gap-2" [ngClass]="isOwn(msg) ? 'justify-end' : 'justify-start'">

            <!-- Avatar esquerdo (outros usuários) -->
            @if (!isOwn(msg)) {
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 self-start mt-1 bg-slate-600"
                [attr.aria-label]="'Avatar de ' + msg.username"
              >{{ primeiraLetra(msg.username) }}</div>
            }

            <div class="flex flex-col max-w-[70%]" [ngClass]="isOwn(msg) ? 'items-end' : 'items-start'">

              <!-- Balão -->
              <div
                class="rounded-2xl px-4 py-3 shadow-sm w-full"
                [ngClass]="isOwn(msg) ? 'bg-teal-600 rounded-br-sm' : 'bg-slate-800 rounded-bl-sm'"
              >
                @if (!isOwn(msg)) {
                  <div class="text-xs font-semibold text-teal-400 mb-1">{{ msg.username }}</div>
                }
                <p class="text-white text-sm leading-relaxed break-words">{{ msg.content }}</p>
                <div class="text-xs mt-1" [ngClass]="isOwn(msg) ? 'text-teal-200 text-right' : 'text-slate-500'">
                  {{ msg.timestamp | date:'HH:mm' }}
                </div>
              </div>

              <!-- Barra de ações -->
              <div class="flex items-center gap-3 mt-1 px-1">

                <!-- Like -->
                <button
                  class="flex items-center gap-1 text-xs transition-colors"
                  [ngClass]="msg.tipoAvaliacaoUsuario === 'LIKE' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'"
                  (click)="avaliar(msg.id, 'LIKE')"
                  [attr.aria-label]="'Curtir, ' + msg.likeCount + ' curtidas'"
                  [attr.aria-pressed]="msg.tipoAvaliacaoUsuario === 'LIKE'"
                >
                  <!-- Ícone thumbs-up minimalista -->
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                  <span>{{ msg.likeCount }}</span>
                </button>

                <!-- Dislike -->
                <button
                  class="flex items-center gap-1 text-xs transition-colors"
                  [ngClass]="msg.tipoAvaliacaoUsuario === 'DISLIKE' ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'"
                  (click)="avaliar(msg.id, 'DISLIKE')"
                  [attr.aria-label]="'Não curtir, ' + msg.dislikeCount + ' não curtidas'"
                  [attr.aria-pressed]="msg.tipoAvaliacaoUsuario === 'DISLIKE'"
                >
                  <!-- Ícone thumbs-down minimalista -->
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                    <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                  </svg>
                  <span>{{ msg.dislikeCount }}</span>
                </button>

                <!-- Responder -->
                <button
                  class="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  (click)="alternarResposta(msg.id)"
                  aria-label="Responder mensagem"
                >
                  <!-- Ícone reply minimalista -->
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 17 4 12 9 7"/>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                  </svg>
                  <span>Responder</span>
                </button>

                <!-- Toggle respostas (exibido apenas quando há respostas) -->
                @if (msg.respostas && msg.respostas.length > 0) {
                  <button
                    class="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors ml-1"
                    (click)="alternarVisibilidadeRespostas(msg.id)"
                    [attr.aria-label]="respostasVisiveis(msg.id) ? 'Ocultar respostas' : 'Ver ' + msg.respostas.length + ' respostas'"
                    [attr.aria-expanded]="respostasVisiveis(msg.id)"
                  >
                    <!-- Chevron que rotaciona conforme estado -->
                    <svg
                      class="w-3.5 h-3.5 transition-transform duration-200"
                      [ngClass]="respostasVisiveis(msg.id) ? 'rotate-180' : ''"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    <span>{{ respostasVisiveis(msg.id) ? 'Ocultar' : msg.respostas.length + ' respostas' }}</span>
                  </button>
                }
              </div>

              <!-- Campo de resposta inline -->
              @if (replyingToId() === msg.id) {
                <div class="mt-2 w-full flex flex-col gap-2">
                  <textarea
                    class="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 resize-none border border-slate-700 focus:outline-none focus:border-teal-500 placeholder-slate-500"
                    rows="2"
                    placeholder="Digite sua resposta..."
                    [value]="replyContent()"
                    (input)="onReplyInput($event)"
                    aria-label="Campo de resposta"
                  ></textarea>
                  <div class="flex gap-2 justify-end">
                    <button
                      class="px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors"
                      (click)="cancelarResposta()"
                      aria-label="Cancelar resposta"
                    >Cancelar</button>
                    <button
                      class="px-3 py-1 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      [disabled]="!replyContent().trim()"
                      (click)="enviarResposta(msg.id)"
                      aria-label="Enviar resposta"
                    >Enviar</button>
                  </div>
                </div>
              }

              <!-- Respostas aninhadas (colapsáveis) -->
              @if (msg.respostas && msg.respostas.length > 0 && respostasVisiveis(msg.id)) {
                <div class="mt-2 w-full flex flex-col gap-2 pl-4 border-l-2 border-slate-700">
                  @for (resposta of msg.respostas; track resposta.id) {
                    <div class="flex gap-2 ml-2">

                      <!-- Avatar da resposta -->
                      <div
                        class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 self-start mt-1 bg-slate-600"
                        [attr.aria-label]="'Avatar de ' + resposta.username"
                      >{{ primeiraLetra(resposta.username) }}</div>

                      <div class="flex flex-col flex-1">
                        <div class="rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm bg-slate-700/50">
                          <div class="text-xs font-semibold text-teal-400 mb-1">{{ resposta.username }}</div>
                          <p class="text-white text-sm leading-relaxed break-words">{{ resposta.content }}</p>
                          <div class="text-xs mt-1 text-slate-500">{{ resposta.timestamp | date:'HH:mm' }}</div>
                        </div>

                        <!-- Ações da resposta (sem botão Responder) -->
                        <div class="flex items-center gap-3 mt-1 px-1">

                          <!-- Like resposta -->
                          <button
                            class="flex items-center gap-1 text-xs transition-colors"
                            [ngClass]="resposta.tipoAvaliacaoUsuario === 'LIKE' ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'"
                            (click)="avaliar(resposta.id, 'LIKE')"
                            [attr.aria-label]="'Curtir resposta, ' + resposta.likeCount + ' curtidas'"
                            [attr.aria-pressed]="resposta.tipoAvaliacaoUsuario === 'LIKE'"
                          >
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                            </svg>
                            <span>{{ resposta.likeCount }}</span>
                          </button>

                          <!-- Dislike resposta -->
                          <button
                            class="flex items-center gap-1 text-xs transition-colors"
                            [ngClass]="resposta.tipoAvaliacaoUsuario === 'DISLIKE' ? 'text-red-400' : 'text-slate-500 hover:text-slate-300'"
                            (click)="avaliar(resposta.id, 'DISLIKE')"
                            [attr.aria-label]="'Não curtir resposta, ' + resposta.dislikeCount + ' não curtidas'"
                            [attr.aria-pressed]="resposta.tipoAvaliacaoUsuario === 'DISLIKE'"
                          >
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
                              <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
                            </svg>
                            <span>{{ resposta.dislikeCount }}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Avatar direito (usuário atual) -->
            @if (isOwn(msg)) {
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 self-start mt-1 bg-teal-600"
                [attr.aria-label]="'Seu avatar'"
              >{{ primeiraLetra(msg.username) }}</div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class ChatMessagesComponent {
  messages = input.required<ChatMessage[]>();
  isLoading = input<boolean>(false);
  currentUserId = input.required<number>();

  /** ID da mensagem cujo campo de resposta está aberto */
  readonly replyingToId = signal<number | null>(null);

  /** Conteúdo digitado no campo de resposta */
  readonly replyContent = signal<string>('');

  /** IDs das mensagens com respostas colapsadas (ocultas) */
  readonly respostasColapsadas = signal<Set<number>>(new Set());

  private readonly chatService = inject(ChatService);
  private readonly scrollContainer = viewChild<ElementRef>('scrollContainer');

  constructor() {
    effect(() => {
      const msgs = this.messages();
      if (msgs.length > 0) setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  isOwn(msg: ChatMessage): boolean {
    return msg.userId === this.currentUserId();
  }

  primeiraLetra(username: string): string {
    return username?.charAt(0).toUpperCase() ?? '?';
  }

  /** Verifica se as respostas de uma mensagem estão visíveis */
  respostasVisiveis(mensagemId: number): boolean {
    return !this.respostasColapsadas().has(mensagemId);
  }

  /** Alterna a visibilidade das respostas de uma mensagem */
  alternarVisibilidadeRespostas(mensagemId: number): void {
    this.respostasColapsadas.update(set => {
      const novo = new Set(set);
      if (novo.has(mensagemId)) {
        novo.delete(mensagemId);
      } else {
        novo.add(mensagemId);
      }
      return novo;
    });
  }

  avaliar(mensagemId: number, tipo: 'LIKE' | 'DISLIKE'): void {
    this.chatService.avaliarMensagem(mensagemId, tipo);
  }

  alternarResposta(mensagemId: number): void {
    if (this.replyingToId() === mensagemId) {
      this.cancelarResposta();
    } else {
      this.replyingToId.set(mensagemId);
      this.replyContent.set('');
    }
  }

  onReplyInput(event: Event): void {
    this.replyContent.set((event.target as HTMLTextAreaElement).value);
  }

  enviarResposta(mensagemPaiId: number): void {
    const conteudo = this.replyContent().trim();
    if (!conteudo) return;
    this.chatService.responderMensagem(mensagemPaiId, conteudo);
    this.cancelarResposta();
    // Garante que as respostas fiquem visíveis após enviar
    this.respostasColapsadas.update(set => {
      const novo = new Set(set);
      novo.delete(mensagemPaiId);
      return novo;
    });
  }

  cancelarResposta(): void {
    this.replyingToId.set(null);
    this.replyContent.set('');
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer()?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
