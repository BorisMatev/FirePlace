import { Component, inject } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [GalleriaModule,AnimateOnScrollModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  animations:[
    trigger("showOnScroll",[
      state("first",style({
        opacity: 0,
        transform: 'translateX(200px)',
      })),
      state("second",style({
        opacity: 1,
        transform: 'translateX(0px)',
      })),
      transition('first => second', animate('2s')),
    ])
  ]
})
export class WelcomePageComponent {
  shown = "first";

  asd(){
    this.shown = "second"
  }

  images = [
    "../../assets/gallery/bench.jpeg",
    "../../assets/gallery/sky.jpg",
    "../../assets/gallery/waterfall.jpg",
    "../../assets/gallery/lake.jpeg",
    "../../assets/gallery/asdq.jpg"
  ];
}
