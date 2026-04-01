import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { HeroComponent } from '../../layout/hero/hero.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { SobreComponent } from '../sobre/sobre.component';
import { PalestrasComponent } from '../palestras/palestras.component';
import { DividerComponent } from '../../shared/divider/divider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    SobreComponent,
    PalestrasComponent,
    DividerComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
