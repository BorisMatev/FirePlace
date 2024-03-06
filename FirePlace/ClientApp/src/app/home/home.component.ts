import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { UserService } from '../core/services/user.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PhotoService } from '../core/services/photo.service';
import { ProfileDataService } from '../User/profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InputTextModule, ToggleButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly userServise: UserService = inject(UserService);
  private readonly photoServise: PhotoService = inject(PhotoService);
  private readonly profileDataService: ProfileDataService = inject(ProfileDataService);
  private readonly router: Router = inject(Router);

  value: string = '';
  checked: boolean = false;
  showNotFound: boolean = false;

  usersList: any = [];

  changeSerach() {
    this.usersList = [];
    this.showNotFound = false;
    this.value = '';
  }

  searchUser() {
    const body = this.value;
    this.userServise.getUsersByUsername(body).subscribe({
      next: (resp) => {
        this.usersList = resp;
        this.showNotFound = true;
      },
      error: (error) => console.log(error),
    });
  }

  searchPhotosByCategory() {
    const body = this.value;
    this.photoServise.getPhotosByCategories(body).subscribe({
      next: (resp) => console.log(resp),
      error: (error) => console.log(error),
    });
  }

  openUser(name: string): void {
    this.userServise.getInfoByUsername(name).subscribe({
      next: resp => this.profileDataService.setUser(resp),
      error: error => console.log(error),
      complete: () => this.router.navigateByUrl('/profile')
    });
  }
}