import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';

import { Component, inject } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { EMPTY, Observable } from 'rxjs';
import { PhotoService } from '../../core/services/photo.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [SkeletonModule,MapComponent, AsyncPipe,ChipModule],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
export class PhotoComponent {

  private readonly photoService: PhotoService = inject(PhotoService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);

  photo$: Observable<any> = EMPTY;

  ngOnInit(){
    this.fetchPhoto();
  }

  fetchPhoto(){
    let id = this.activeRoute.snapshot.paramMap.get('id')!;
    this.photo$ = this.photoService.getById(Number(id));
    // this.photoService.getById(Number(id)).subscribe(resp => console.log(resp));
  }
}
