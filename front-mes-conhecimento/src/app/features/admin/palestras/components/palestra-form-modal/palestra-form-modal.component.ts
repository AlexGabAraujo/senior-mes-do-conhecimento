import { Component, input, output, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Lecture, LectureType, TargetAudience } from '../../../../../core/models/lecture.model';
import { FileUploadService } from '../../../../../core/services/file-upload.service';

@Component({
  selector: 'app-palestra-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './palestra-form-modal.component.html'
})
export class PalestraFormModalComponent implements OnInit {
  readonly lecture = input<Lecture | null>(null);
  readonly close = output<void>();
  readonly save = output<Lecture>();

  #fb = inject(FormBuilder);
  #datePipe = inject(DatePipe);
  #fileUploadService = inject(FileUploadService);

  imagePreview = signal<string | null>(null);
  uploadError = signal<string | null>(null);
  isUploading = signal(false);

  form = this.#fb.nonNullable.group({
    id: [0],
    speaker: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    type: ['PALESTRA' as LectureType, [Validators.required]],
    targetAudience: ['TODOS' as TargetAudience, [Validators.required]],
    speakerImagePath: [''],
    registrationUrl: [''],
    finished: [false]
  });

  ngOnInit() {
    const l = this.lecture();
    if (l) {
      const dateString = this.#datePipe.transform(l.date, 'yyyy-MM-dd') || '';
      this.form.patchValue({
        id: l.id,
        speaker: l.speaker,
        title: l.title,
        description: l.description,
        date: dateString,
        time: l.time,
        type: l.type,
        targetAudience: l.targetAudience,
        speakerImagePath: l.speakerImagePath,
        registrationUrl: l.registrationUrl || '',
        finished: l.finished
      });
      
      // Se já tem imagem, mostra preview
      if (l.speakerImagePath) {
        this.imagePreview.set(l.speakerImagePath);
      }
    }
  }

  async onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadError.set(null);

    // Valida o arquivo
    const validation = this.#fileUploadService.validateImage(file);
    if (!validation.valid) {
      this.uploadError.set(validation.error || 'Arquivo inválido');
      return;
    }

    try {
      this.isUploading.set(true);

      // Cria preview
      const preview = await this.#fileUploadService.createImagePreview(file);
      this.imagePreview.set(preview);

      // Salva localmente e obtém a URL
      const imagePath = await this.#fileUploadService.saveImageLocally(file);
      
      // Atualiza o formulário com o caminho da imagem
      this.form.patchValue({ speakerImagePath: imagePath });
      
    } catch (error) {
      this.uploadError.set('Erro ao processar a imagem');
      console.error('Image processing error:', error);
    } finally {
      this.isUploading.set(false);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();

    // Data ajustada para a base local evitando problemas GMT
    const [year, month, day] = val.date.split('-').map(Number);
    const resultDate = new Date(year, month - 1, day);

    const payload: Lecture = {
      id: val.id,
      speaker: val.speaker,
      title: val.title,
      description: val.description,
      date: resultDate,
      time: val.time,
      type: val.type as LectureType,
      targetAudience: val.targetAudience as TargetAudience,
      speakerImagePath: val.speakerImagePath || '/assets/images/lectures/default.jpg',
      registrationUrl: val.registrationUrl || '',
      finished: val.finished
    };

    this.save.emit(payload);
  }
}
