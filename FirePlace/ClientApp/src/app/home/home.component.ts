import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { UserService } from '../core/servises/user.service';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InputTextModule,ToggleButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private userServise: UserService = inject(UserService);
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

  searchCategory(){
    const body = this.value;

    
  }
}

// export interface UserInfo {
//   name: string,
//   userId: number,
//   photoString: string,

// }