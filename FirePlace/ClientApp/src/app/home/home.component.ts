import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { UserService } from '../core/servises/user.service';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, InputTextModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private userServise: UserService = inject(UserService);
  value: string = "";

  usersList: UserInfo[] = [
    {
      userId: 1,
      photoString: "aqswdawd",
      name:"asdasd"
    },
    {
      userId: 1,
      photoString: "aqswdawd",
      name:"asdasd"
    },
    {
      userId: 1,
      photoString: "aqswdawd",
      name:"asdasd"
    },
    {
      userId: 1,
      photoString: "aqswdawd",
      name:"asdasd"
    },
  ]


  searchUser() {
    const body = this.value;

    this.userServise.getUserByUsername(body).pipe(
      map(resp => {
        return resp;
      }),
      catchError(error => {
        return error; // From 'rxjs'
      })
    )
    // .subscribe({
    //   next: resp => console.log(resp),
    //   error: error => console.log(error)
    // })
  }
}

export interface UserInfo {
  name: string,
  userId: number,
  photoString: string,

}