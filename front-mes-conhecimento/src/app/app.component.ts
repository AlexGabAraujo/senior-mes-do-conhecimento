import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { HeroComponent } from './layout/hero/hero.component';
import { FooterComponent } from './layout/footer/footer.component';

/**
 * AppComponent — Shell principal da aplicação.
 * Compõe todos os componentes de layout e features.
 * Seções com scroll-snap são montadas aqui na sequência correta.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
