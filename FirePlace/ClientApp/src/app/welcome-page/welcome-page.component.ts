import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [GalleriaModule, AnimateOnScrollModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  animations: [
    trigger("showOnScroll", [
      state("first", style({
        opacity: 0,
        transform: 'translateX(100px)',
      })),
      state("second", style({
        opacity: 1,
        transform: 'translateX(0px)',
      })),
      state("left", style({
        transform: 'translateX(-1000px)'
      })),
      state("right", style({
        transform: 'translateX(0px)'
      })),
      transition('first => second', animate('1s')),
      transition('left => right', animate('1s'))
    ])
  ]
})
export class WelcomePageComponent {
  shown = "first";
  move = "left";

  animation() {
    this.shown = "second";
    this.move = "right";
  }

  @ViewChild('test') testElement!: ElementRef;

  isElementInViewport(element: HTMLElement): boolean {
    return element.getBoundingClientRect().top <= 500;
  }


  @HostListener('mousewheel')
  onScroll(): void {
    const element = this.testElement.nativeElement;
    if (this.isElementInViewport(element)) {
      this.animation();
    }
  }


  images = [
    "../../assets/gallery/camp.jpg",
    "../../assets/gallery/bench.jpeg",
    "../../assets/gallery/sky.jpg",
    "../../assets/gallery/waterfall.jpg",
    "../../assets/gallery/lake.jpeg",
    "../../assets/gallery/asdq.jpg"
  ];
}
