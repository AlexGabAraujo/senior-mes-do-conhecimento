import { Component, input, output, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Lecture, LectureType, TargetAudience } from '../../../../core/models/lecture.model';

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

  form = this.#fb.nonNullable.group({
    id: [0],
    speaker: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    date: ['', [Validators.required]],
    time: ['', [Validators.required]],
    type: ['Palestra' as LectureType, [Validators.required]],
    targetAudience: ['Todos' as TargetAudience, [Validators.required]],
    speakerImagePath: ['']
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
        speakerImagePath: l.speakerImagePath
      });
    }
  }

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.patchValue({ speakerImagePath: '/assets/images/lectures/uploaded.jpg' });
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
      speakerImagePath: val.speakerImagePath || '/assets/images/lectures/default.jpg'
    };

    this.save.emit(payload);
  }
}
