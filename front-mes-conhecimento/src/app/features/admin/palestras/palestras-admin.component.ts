import { Component } from '@angular/core';

@Component({
  selector: 'app-palestras-admin',
  standalone: true,
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">Gestão de Palestras</h2>
        <button class="bg-[#00D28E] hover:bg-[#00B090] text-[#0A0B10] font-bold py-2 px-4 rounded transition-colors text-sm">
          + Nova Palestra
        </button>
      </div>
      <div class="bg-[#0F111A] border border-[#1E293B] rounded-xl p-8 flex items-center justify-center min-h-[400px]">
        <p class="text-[#64748B]">Módulo de gestão em construção (Task 4)</p>
      </div>
    </div>
  `
})
export class PalestrasAdminComponent {}
