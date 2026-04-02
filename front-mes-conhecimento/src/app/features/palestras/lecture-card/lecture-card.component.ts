import { Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Lecture } from '../../../core/models/lecture.model';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { AuthService } from '../../../core/services/auth.service';

/**
 * LectureCardComponent — Card individual de palestra/oficina.
 *
 * Dumb component: recebe uma Lecture via @input() e renderiza o card completo.
 * Usado em: PalestrasComponent (grid de cards)
 *
 * Design fiel ao site de referência:
 * - Imagem do palestrante com overlay gradiente (topo → opaco na base)
 * - Nome em teal com ícone de pessoa
 * - Título, descrição, público-alvo
 * - Rodapé com data, horário e badge de tipo
 */
@Component({
  selector: 'app-lecture-card',
  standalone: true,
  imports: [BadgeComponent, DatePipe],
  templateUrl: './lecture-card.component.html',
})
export class LectureCardComponent {
  /** Dados completos da palestra — fornecidos pelo PalestrasComponent */
  readonly lecture = input.required<Lecture>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;

  /**
   * Fallback de imagem: usa um avatar genérico quando a imagem do palestrante
   * não está disponível (caminho local que não existe ainda).
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Placeholder gerado com initials do nome do palestrante
    const nome = this.lecture().speaker.split(' ')[0];
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0a0b10&color=00b090&size=400&bold=true&font-size=0.4`;
    img.onerror = null; // Previne loop infinito
  }

  /** Navega para a página de discussões com o chat da palestra selecionado */
  acessarChat(): void {
    this.router.navigate(['/discussoes'], { queryParams: { lectureId: this.lecture().id } });
  }
}
