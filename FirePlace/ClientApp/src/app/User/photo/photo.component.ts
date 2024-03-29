import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';

import { Component, inject } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { EMPTY, Observable } from 'rxjs';
import { PhotoService } from '../../core/services/photo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [SkeletonModule, MapComponent, AsyncPipe, ChipModule],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss'
})
export class PhotoComponent {

  private readonly photoService: PhotoService = inject(PhotoService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  photo$: Observable<any> = EMPTY;

  ngOnInit(): void {
    this.fetchPhoto();
  }

  fetchPhoto(): void {
    let id = this.activeRoute.snapshot.paramMap.get('id')!;
    this.photo$ = this.photoService.getById(Number(id));
  }

  openUser(name: string): void {
    this.router.navigate(['/user/', name])
  }
}
