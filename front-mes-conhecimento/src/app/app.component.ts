import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './layout/hero/hero.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SobreComponent } from './features/sobre/sobre.component';
import { PalestrasComponent } from './features/palestras/palestras.component';
import { DividerComponent } from './shared/divider/divider.component';

/**
 * AppComponent — Shell principal da aplicação.
 * Compõe todos os componentes de layout e features na ordem do scroll snap.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    SobreComponent,
    PalestrasComponent,
    DividerComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
