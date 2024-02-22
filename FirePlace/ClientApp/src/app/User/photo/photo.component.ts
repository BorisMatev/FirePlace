import { SkeletonModule } from 'primeng/skeleton';

import { Component } from '@angular/core';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [SkeletonModule,MapComponent],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
export class PhotoComponent {
  ngOnInit(){

  }
}
