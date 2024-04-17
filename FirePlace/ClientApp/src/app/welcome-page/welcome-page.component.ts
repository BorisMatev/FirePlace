import { Component } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';
@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [GalleriaModule, AnimateOnScrollModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent {
  images = [
    "../../assets/gallery/camp.jpg",
    "../../assets/gallery/bench.jpeg",
    "../../assets/gallery/sky.jpg",
    "../../assets/gallery/waterfall.jpg",
    "../../assets/gallery/lake.jpeg",
    "../../assets/gallery/asdq.jpg"
  ];
}
