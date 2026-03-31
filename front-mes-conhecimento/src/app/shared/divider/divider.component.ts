import { Component } from '@angular/core';

/**
 * DividerComponent — Separador visual entre seções.
 * Exibe uma linha com gradiente teal e um ponto brilhante no centro,
 * idêntica à que existe no final da página.
 */
@Component({
  selector: 'app-divider',
  standalone: true,
  template: `
    <div class="container mx-auto px-6" style="max-width: 1200px; padding-top: 2rem; padding-bottom: 2rem;">
      <div class="flex items-center justify-center gap-4 w-full" aria-hidden="true">
        <div style="height: 1px; flex: 1; background: linear-gradient(to right, transparent, rgba(0,176,144,0.3));"></div>
        <div style="width: 6px; height: 6px; background: #00b090; border-radius: 50%;"></div>
        <div style="height: 1px; flex: 1; background: linear-gradient(to left, transparent, rgba(0,176,144,0.3));"></div>
      </div>
    </div>
  `,
})
export class DividerComponent {}
