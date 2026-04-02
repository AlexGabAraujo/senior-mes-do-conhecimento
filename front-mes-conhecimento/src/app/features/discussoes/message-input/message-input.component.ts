import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-message-input',
  standalone: true,
  template: `
    <div class="flex gap-3 p-4 bg-slate-900/80 border-t border-slate-800">
      <input
        type="text"
        placeholder="Digite sua mensagem..."
        class="flex-1 px-4 py-3 bg-slate-800 text-white text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-teal-500 placeholder-slate-500"
        [value]="messageContent()"
        (input)="onInputChange($event)"
        (keydown.enter)="enviar()"
        aria-label="Campo de mensagem"
      />
      <button
        class="px-5 py-3 bg-teal-600 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-500"
        [disabled]="!messageContent().trim()"
        (click)="enviar()"
        aria-label="Enviar mensagem"
      >
        Enviar
      </button>
    </div>
  `,
})
export class MessageInputComponent {
  messageSent = output<string>();
  readonly messageContent = signal<string>('');

  onInputChange(event: Event): void {
    this.messageContent.set((event.target as HTMLInputElement).value);
  }

  enviar(): void {
    const content = this.messageContent().trim();
    if (!content) return;

    this.messageSent.emit(content);
    this.messageContent.set('');
  }
}
