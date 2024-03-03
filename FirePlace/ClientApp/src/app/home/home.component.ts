import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { UserService } from '../core/servises/user.service';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PhotoService } from '../core/servises/photo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InputTextModule,ToggleButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private userServise: UserService = inject(UserService);
  private photoServise: PhotoService = inject(PhotoService);

  value: string = "";
  checked: boolean = false;
  showNotFound: boolean = false;

  usersList: any = []

  changeSerach(){
    this.usersList = [];
    this.showNotFound = false;
    this.value = "";
  }

  searchUser() {
    const body = this.value;
    this.userServise.getUserByUsername(body)
    .subscribe({
      next: resp => {
        this.usersList = resp;
        this.showNotFound = true;
      },
      error: error => console.log(error)
    })
  }

  searchPhotosByCategory(){
    const body = this.value;
    this.photoServise.getPhotosByCategories(body).subscribe({
      next: resp => console.log(resp),
      error: error => console.log(error)
    })
    
  }
}

// export interface UserInfo {
//   name: string,
//   userId: number,
//   photoString: string,

// }