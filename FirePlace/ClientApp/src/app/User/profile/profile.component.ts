import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { RouterLink } from '@angular/router';
import { ProfileDataService } from './profile.service';
import { EMPTY, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, RouterLink, NgIf, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private readonly profileDataService: ProfileDataService = inject(ProfileDataService)

  user$: Observable<any> = EMPTY;

  logout() {
    // localStorage.removeItem("token");
    // this.user.checkToken();
    // console.log(this.userInfo)
  }

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    // this.user.getUser().subscribe({
    //   next: resp => this.userInfo = resp,
    //   error: error => console.log(error),
    //   complete: () => console.log(this.userInfo)
    // });

    this.user$ = this.profileDataService.user;
  }
}