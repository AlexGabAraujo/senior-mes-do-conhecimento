import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Lecture, LectureState, LectureType } from '../models/lecture.model';

@Injectable({
  providedIn: 'root',
})
export class LectureService {
  private http = inject(HttpClient);
  
  // A URL foi criada com base no DDD
  private readonly baseUrl = 'http://localhost:8080/api/lectures';
  private readonly adminUrl = 'http://localhost:8080/api/admin/lectures';

  readonly #state = signal<LectureState>({
    lectures: [],
    isLoading: true,
    error: null,
  });

  readonly lectures = computed(() => this.#state().lectures);
  readonly isLoading = computed(() => this.#state().isLoading);
  readonly error = computed(() => this.#state().error);

  readonly totalLectures = computed(() => this.lectures().length);
  readonly totalPalestras = computed(() => this.lectures().filter(l => l.type === 'PALESTRA').length);
  readonly totalOficinas = computed(() => this.lectures().filter(l => l.type === 'OFICINA').length);

  constructor() {
    this.carregarDados();
  }

  filtrarPorTipo(tipo: LectureType | null): Lecture[] {
    if (!tipo) return this.lectures();
    return this.lectures().filter(l => l.type === tipo);
  }

  // ─── CRUD (Via HTTP mantendo reatividade Signal View) ───────────────

  criar(palestra: Omit<Lecture, 'id'>): void {
    // Ajusta a data para string YYYY-MM-DD para serialização no POST do Spring
    const payload = { ...palestra, date: this.toISODate(palestra.date) };

    this.http.post<Lecture>(this.adminUrl, payload).subscribe({
      next: (novaPalestra) => {
        novaPalestra.date = new Date(novaPalestra.date); // Parsing string -> Date
        novaPalestra.finished = novaPalestra.finished || false; // Garante que finished existe
        this.#state.update((s) => ({
          ...s,
          lectures: [novaPalestra, ...s.lectures]
        }));
      },
      error: (err) => console.error(err)
    });
  }

  atualizar(palestra: Lecture): void {
    const payload = { ...palestra, date: this.toISODate(palestra.date) };
    
    this.http.put<Lecture>(`${this.adminUrl}/${palestra.id}`, payload).subscribe({
      next: (atualizada) => {
        atualizada.date = new Date(atualizada.date);
        atualizada.finished = atualizada.finished || false; // Garante que finished existe
        this.#state.update((s) => ({
          ...s,
          lectures: s.lectures.map((l) => (l.id === atualizada.id ? atualizada : l))
        }));
      },
      error: (err) => console.error(err)
    });
  }

  excluir(id: number): void {
    this.http.delete(`${this.adminUrl}/${id}`).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          lectures: s.lectures.filter((l) => l.id !== id)
        }));
      },
      error: (err) => console.error(err)
    });
  }

  // ─── Carregamento de Dados Remotos ─────────────────────────────────────────

  private carregarDados(): void {
    const params = new HttpParams().set('size', 100); // Puxa a listagem estendida pro front
    
    this.http.get<any>(this.baseUrl, { params }).subscribe({
      next: (page) => {
        // Mapeia o Spring { content: [...] } (PageImpl) 
        const items = page.content.map((item: any) => ({
           ...item,
           date: new Date(item.date), // Converte String SQL pra JS Date obj
           finished: item.finished || false // Garante que finished existe
        }));

        this.#state.set({ lectures: items, isLoading: false, error: null });
      },
      error: (err) => {
        this.#state.set({ lectures: [], isLoading: false, error: 'Falha de comunicação com o servidor Spring.' });
      }
    });
  }

  // Helper de serialização
  private toISODate(date: any): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }
}
