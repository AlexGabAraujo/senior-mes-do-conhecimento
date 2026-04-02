import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ChatRoom } from '../../../core/models/chat-room.model';


type StatusFilter = 'all' | 'finished' | 'upcoming';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [DatePipe, NgClass],  template: `
    <div class="flex flex-col h-full bg-slate-900/50">
      <!-- Header -->
      <div class="p-5 border-b border-slate-800 flex items-center gap-2">
        <!-- Seta de voltar para a home -->
        <button
          (click)="router.navigate(['/'])"
          aria-label="Voltar para a página inicial"
          class="text-slate-400 hover:text-white transition-colors flex-shrink-0"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h2 class="text-lg font-bold text-white">Discussões</h2>
      </div>

      <!-- Pesquisa -->
      <div class="p-4 pb-2">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          class="w-full px-3 py-2 bg-slate-800 text-white text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-teal-500 placeholder-slate-500"
          [value]="searchTerm()"
          (input)="onSearchChange($event)"
        />
      </div>

      <!-- Filtros de status -->
      <div class="px-4 pb-3 flex gap-1">
        @for (f of filterOptions; track f.value) {
          <button
            class="flex-1 px-2 py-1 rounded text-xs font-medium transition-colors"
            [ngClass]="statusFilter() === f.value
              ? 'bg-teal-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'"
            (click)="statusFilter.set(f.value)"
          >
            {{ f.label }}
          </button>
        }
      </div>

      <!-- Lista de chats -->
      <div class="flex-1 overflow-y-auto">
        @if (isLoading()) {
          <div class="p-4 text-slate-500 text-sm text-center">Carregando...</div>
        } @else if (filteredRooms().length === 0) {
          <div class="p-4 text-slate-500 text-sm text-center">Nenhum chat encontrado</div>
        } @else {
          @for (room of filteredRooms(); track (room.lectureId ?? 'general')) {
            <button
              class="w-full p-4 text-left border-b border-slate-800/50 transition-colors"
              [ngClass]="isSelected(room)
                ? 'bg-slate-700/60 border-l-2 border-l-teal-500'
                : 'hover:bg-slate-800/40'"
              (click)="roomSelected.emit(room)"
            >
              <!-- Ícone + nome -->
              <div class="flex items-center gap-2">
                @if (room.isGeneral) {
                  <!-- Ícone de chat geral: balão de mensagem minimalista -->
                  <svg class="w-4 h-4 flex-shrink-0 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                } @else {
                  <!-- Ícone de palestra: microfone minimalista -->
                  <svg class="w-4 h-4 flex-shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                }
                <span class="font-medium text-sm text-white truncate">{{ room.name }}</span>
              </div>
              <!-- Data da palestra -->
              @if (room.lectureDate) {
                <div class="text-xs text-slate-500 mt-1 ml-6">
                  {{ room.lectureDate | date:'dd/MM/yyyy' }}
                </div>
              }
            </button>
          }
        }
      </div>
    </div>
  `,
})
export class ChatSidebarComponent {
  rooms = input.required<ChatRoom[]>();
  selectedRoom = input<ChatRoom | null>(null);
  isLoading = input<boolean>(false);
  roomSelected = output<ChatRoom>();

  readonly router = inject(Router);
  readonly searchTerm = signal<string>('');
  readonly statusFilter = signal<StatusFilter>('all');

  readonly filterOptions: { label: string; value: StatusFilter }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Já ocorreram', value: 'finished' },
    { label: 'Não ocorreram', value: 'upcoming' },
  ];

  /**
   * Computed que aplica pesquisa + filtro de status simultaneamente.
   * Chat Geral sempre permanece visível independente do filtro de status.
   */
  readonly filteredRooms = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    const now = new Date();

    return this.rooms().filter(room => {
      // Filtro de pesquisa (case-insensitive)
      if (search && !room.name.toLowerCase().includes(search)) return false;

      // Chat Geral ignora filtro de status
      if (room.isGeneral) return true;

      // Filtro de status para palestras
      if (status === 'all') return true;
      if (!room.lectureDate) return false;

      const isPast = room.lectureDate < now;
      return status === 'finished' ? isPast : !isPast;
    });
  });

  isSelected(room: ChatRoom): boolean {
    const sel = this.selectedRoom();
    if (!sel) return false;
    return sel.lectureId === room.lectureId;
  }

  onSearchChange(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }
}
