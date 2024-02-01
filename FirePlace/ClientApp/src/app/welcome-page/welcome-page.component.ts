import { Component, inject } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  images = [
    "../../assets/gallery/bench.jpeg",
    "../../assets/gallery/sky.jpg",
    "../../assets/gallery/waterfall.jpg"
  ];
}
