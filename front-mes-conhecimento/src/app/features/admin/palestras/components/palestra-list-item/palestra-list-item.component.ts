import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Lecture } from '../../../../../core/models/lecture.model';

@Component({
  selector: 'app-palestra-list-item',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div
      class="flex items-center gap-4 bg-[#151822] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#00B090] rounded-lg p-4 transition-all duration-200 group cursor-pointer"
    >
      <img
        [src]="lecture().speakerImagePath"
        (error)="onImageError($event)"
        alt="Foto palestrante"
        class="w-12 h-12 rounded bg-[#1E293B] object-cover flex-shrink-0"
      />

      <div class="flex-1 min-w-0">
        <h3 class="text-white font-bold text-sm truncate">{{ lecture().title }}</h3>
        <p class="text-[#94A3B8] text-xs mt-1 truncate">
          {{ lecture().speaker }} • {{ lecture().date | date:'dd/MM/yyyy' }} às {{ lecture().time }}
        </p>
      </div>

      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button (click)="onEdit($event)" class="p-2 text-[#94A3B8] hover:text-[#00B090] transition-colors rounded-md hover:bg-[#00B090]/10" title="Editar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
        <button (click)="onDelete($event)" class="p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors rounded-md hover:bg-[#EF4444]/10" title="Excluir">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
  `
})
export class PalestraListItemComponent {
  readonly lecture = input.required<Lecture>();
  readonly edit = output<Lecture>();
  readonly delete = output<Lecture>();

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const nome = this.lecture().speaker.split(' ')[0];
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=1E293B&color=00b090&size=150`;
    img.onerror = null;
  }

  onEdit(e: Event) {
    e.stopPropagation();
    this.edit.emit(this.lecture());
  }

  onDelete(e: Event) {
    e.stopPropagation();
    this.delete.emit(this.lecture());
  }
}
