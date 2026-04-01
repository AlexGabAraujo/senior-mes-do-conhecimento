import { Component, computed, inject, signal } from '@angular/core';
import { PalestraListItemComponent } from './components/palestra-list-item/palestra-list-item.component';
import { PalestraFormModalComponent } from './components/palestra-form-modal/palestra-form-modal.component';
import { LectureService } from '../../../core/services/lecture.service';
import { Lecture, LectureType } from '../../../core/models/lecture.model';

@Component({
  selector: 'app-palestras-admin',
  standalone: true,
  imports: [PalestraListItemComponent, PalestraFormModalComponent],
  template: `
    <div class="flex flex-col gap-6 font-sans">
      <!-- Header / Actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 class="text-xl font-bold text-white">Gestão de Palestras</h2>
        <button
          (click)="openNewModal()"
          class="bg-[#00D28E] hover:bg-[#00B090] text-[#0A0B10] font-bold py-2 px-4 rounded transition-colors text-sm cursor-pointer whitespace-nowrap"
        >
          + Nova Palestra
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 items-center bg-[#0F111A] p-4 rounded-xl border border-[#1E293B]">
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold text-[#94A3B8]">Tipo:</label>
          <select
            (change)="onFilterTypeChange($event)"
            class="h-9 px-3 bg-[#1E293B] border border-[#334155] rounded-md text-sm text-white focus:outline-none focus:border-[#00B090]"
          >
            <option value="Todas">Todas</option>
            <option value="Palestra">Palestras</option>
            <option value="Oficina">Oficinas</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold text-[#94A3B8]">Status:</label>
          <select
            (change)="onFilterStatusChange($event)"
            class="h-9 px-3 bg-[#1E293B] border border-[#334155] rounded-md text-sm text-white focus:outline-none focus:border-[#00B090]"
          >
            <option value="Todas">Todas</option>
            <option value="Ocorridas">Ocorridas</option>
            <option value="Futuras">Futuras</option>
          </select>
        </div>
      </div>

      <!-- List -->
      <div class="flex flex-col gap-3 min-h-[400px]">
        @for (lecture of paginatedLectures(); track lecture.id) {
          <app-palestra-list-item
            [lecture]="lecture"
            (edit)="openEditModal($event)"
            (delete)="deleteLecture($event)"
          />
        } @empty {
          <div class="bg-[#0F111A] border border-[#1E293B] rounded-xl p-8 flex items-center justify-center flex-1">
            <p class="text-[#64748B] text-sm">Nenhuma palestra encontrada com os filtros atuais.</p>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="flex items-center justify-between border-t border-[#1E293B] pt-4 mt-2">
          <p class="text-xs text-[#64748B]">
            Mostrando página {{ currentPage() }} de {{ totalPages() }}
          </p>
          <div class="flex items-center gap-2">
            <button
              [disabled]="currentPage() === 1"
              (click)="changePage(currentPage() - 1)"
              class="px-3 py-1.5 text-xs font-medium text-white bg-[#1E293B] border border-[#334155] rounded hover:bg-[#334155] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Anterior
            </button>
            <button
              [disabled]="currentPage() === totalPages()"
              (click)="changePage(currentPage() + 1)"
              class="px-3 py-1.5 text-xs font-medium text-white bg-[#1E293B] border border-[#334155] rounded hover:bg-[#334155] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Próxima
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Modal Form (Create / Edit) -->
    @if (isModalOpen()) {
      <app-palestra-form-modal
        [lecture]="editingLecture()"
        (close)="closeModal()"
        (save)="onSave($event)"
      />
    }
  `
})
export class PalestrasAdminComponent {
  #lectureService = inject(LectureService);

  // Filters State
  filterType = signal<'Todas' | 'Palestra' | 'Oficina'>('Todas');
  filterStatus = signal<'Todas' | 'Ocorridas' | 'Futuras'>('Todas');

  // Pagination State
  currentPage = signal(1);
  pageSize = 10;

  // Modal State
  isModalOpen = signal(false);
  editingLecture = signal<Lecture | null>(null);

  // Computeds
  filteredLectures = computed(() => {
    let list = this.#lectureService.lectures();

    // Type Filter
    const type = this.filterType();
    if (type !== 'Todas') {
      list = list.filter(l => l.type === type);
    }

    // Status Filter
    const status = this.filterStatus();
    // Normalizando a data atual para zerar a hora (comparacao justa)
    const now = new Date();
    // now.setHours(0,0,0,0); Opcional, dependendo da precisão de 'ocorrida'

    if (status === 'Ocorridas') {
      list = list.filter(l => l.date < now);
    } else if (status === 'Futuras') {
      list = list.filter(l => l.date >= now);
    }

    return list;
  });

  paginatedLectures = computed(() => {
    const list = this.filteredLectures();
    const start = (this.currentPage() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredLectures().length / this.pageSize));
  });

  // Actions
  onFilterTypeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.filterType.set(target.value as any);
    this.currentPage.set(1);
  }

  onFilterStatusChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.filterStatus.set(target.value as any);
    this.currentPage.set(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  openNewModal() {
    this.editingLecture.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(lecture: Lecture) {
    this.editingLecture.set(lecture);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingLecture.set(null);
  }

  onSave(lecture: Lecture | Omit<Lecture, 'id'>) {
    if ('id' in lecture && lecture.id > 0) {
      this.#lectureService.atualizar(lecture as Lecture);
    } else {
      this.#lectureService.criar(lecture as Omit<Lecture, 'id'>);
    }
    this.closeModal();
  }

  deleteLecture(lecture: Lecture) {
    if (confirm(\`Tem certeza que deseja excluir '\${lecture.title}'?\`)) {
      this.#lectureService.excluir(lecture.id);
    }
  }
}
