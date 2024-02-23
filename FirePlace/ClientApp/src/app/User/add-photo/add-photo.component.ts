import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-photo',
  standalone: true,
  imports: [],
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.scss',
  animations: [
    trigger("onLoad", [
      state("first", style({
        opacity: 0,
        transform: 'scale(0.2)'
      })),
      state("second", style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state("right", style({
        transform: 'translateX(305%)',
        height: '210px',
        width: '210px',
        backgroundColor: 'var(--light-purple)',
        borderRadius: '330px'
      })),
      state("left", style({
        transform: 'translateX(0px)',
        backgroundColor: 'rgba(0, 0, 0, 0.502)',
        borderRadius: '20px',
        width: '60%'
      })),

      transition('right => *', [
        animate("1s", keyframes([
          style({
            transform: 'translateX(220%)',
            backgroundColor: 'var(--light-purple)',
            borderRadius: '330px',
            width: '210px',
            height: '210px',
            offset: 0
          }),
          style({
            transform: 'translateX(50%)',
            backgroundColor: 'rgba(123, 42, 78, 0.502)',
            borderRadius: '50px',
            width: '40%',
            offset: 0.7
          }),
          style({
            transform: 'translateX(0px)',
            backgroundColor: 'rgba(0, 0, 0, 0.502)',
            borderRadius: '20px',
            width: '60%',
            height: '50%',
            offset: 1
          })
        ]))
      ]),
      transition('first => second', animate('1s'))
    ])
  ]
})
export class AddPhotoComponent {

  addPhotoBtn = "right";
  info = "first"

  constructor() {
    // Change the value of addPhotoBtn to trigger the animation
    setTimeout(() => {
      this.addPhotoBtn = "left";
      this.info = "second"
    }, 100); // Example delay to trigger the animation after 1 second
  }
}
