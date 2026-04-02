import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { ChatRoom } from '../../core/models/chat-room.model';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ChatMessagesComponent } from './chat-messages/chat-messages.component';
import { MessageInputComponent } from './message-input/message-input.component';

@Component({
  selector: 'app-discussoes',
  standalone: true,
  imports: [ChatSidebarComponent, ChatMessagesComponent, MessageInputComponent],
  template: `
    <div class="flex h-screen bg-[#0a0b10] overflow-hidden">

      <!-- Sidebar -->
      <aside class="w-72 flex-shrink-0 border-r border-slate-800">
        <app-chat-sidebar
          [rooms]="chatService.rooms()"
          [selectedRoom]="chatService.selectedRoom()"
          [isLoading]="chatService.isLoadingRooms()"
          (roomSelected)="onRoomSelected($event)"
        />
      </aside>

      <!-- Área principal -->
      <div class="flex-1 flex flex-col min-w-0">

        <!-- Header da conversa -->
        <div class="px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          @if (chatService.selectedRoom(); as room) {
            <div class="flex items-center gap-2">
              @if (room.isGeneral) {
                <svg class="w-4 h-4 text-teal-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              } @else {
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              }
              <h1 class="text-white font-semibold text-base">{{ room.name }}</h1>
            </div>
          } @else {
            <h1 class="text-slate-500 text-base">Selecione um chat</h1>
          }
        </div>

        <!-- Mensagens -->
        <div class="flex-1 overflow-hidden">
          <app-chat-messages
            [messages]="chatService.messages()"
            [isLoading]="chatService.isLoadingMessages()"
            [currentUserId]="currentUserId()"
          />
        </div>

        <!-- Input -->
        <app-message-input (messageSent)="onMessageSent($event)" />
      </div>
    </div>
  `,
})
export class DiscussoesComponent {
  protected readonly chatService = inject(ChatService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly currentUserId = computed(() => this.authService.currentUser()?.id ?? 0);

  constructor() {
    this.chatService.carregarRooms();

    // Após carregar os rooms, seleciona o chat da palestra se lectureId estiver na URL
    this.route.queryParams.subscribe(params => {
      const lectureId = params['lectureId'] ? Number(params['lectureId']) : null;
      if (lectureId) {
        const rooms = this.chatService.rooms();
        const target = rooms.find(r => r.lectureId === lectureId);
        if (target) this.chatService.selecionarRoom(target);
      }
    });
  }

  onRoomSelected(room: ChatRoom): void {
    this.chatService.selecionarRoom(room);
  }

  onMessageSent(content: string): void {
    this.chatService.enviarMensagem(content);
  }
}
