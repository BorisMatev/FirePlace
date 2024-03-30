import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';

import { UserService } from '../core/services/user.service';
import { PhotoService } from '../core/services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InputTextModule, ToggleButtonModule, DropdownModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly photoService: UserService = inject(UserService);
  private readonly photoServise: PhotoService = inject(PhotoService);
  private readonly router: Router = inject(Router);

  value: string = '';
  checked: boolean = false;
  showNotFound: boolean = false;

  usersList: any = [];
  photos: any = [];
  categories: any = [];


  asd = "asdfpoaihfdh"

  ngOnInit() {
    this.fetchCategories();
  }

  searchUser() {
    const body = this.value;
    this.photoService.getUsersByUsername(body).subscribe({
      next: (resp) => {
        this.usersList = resp;
        this.showNotFound = true;
      },
      error: (error) => console.log(error),
    });
  }

  searchPhotosByCategory() {
    const body: any = this.value;
    this.photoServise.getPhotosByCategories(body.name).subscribe({
      next: (resp) => {
        this.photos = resp;
        this.showNotFound = true;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.photos.sort((a: { likes: number; }, b: { likes: number; }) => b.likes - a.likes);
      }
    });
  }

  fetchCategories(): void {
    this.photoServise.getAllCategories().subscribe({
      next: resp => this.categories = resp,
      error: error => console.log(error)
    })
  }

  like(id: number) {
    this.photoServise.like(id).subscribe({
      next: resp => console.log(resp),
      error: error => console.log(error)
    })
  }

  openUser(name: string): void {
    this.router.navigate(['/user/', name])
  }

  openPhoto(id: number): void {
    this.router.navigate(['/photo',id])
  }


  clear(): void {
    this.usersList = [];
    this.photos = []
    this.showNotFound = false;
    this.value = '';
  }

}