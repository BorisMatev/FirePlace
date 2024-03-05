import { Component, inject } from '@angular/core';
import { UserService } from '../../core/servises/user.service';
import { HeaderComponent } from '../../header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  
  private user = inject(UserService);

  userInfo: any = {
    info: "",
    username: "",
    profilePhoto: "",
    followersCount: 0,
    followingCount: 0,
    photosCount: 0,
    photos: []
  };

  logout(){
    // localStorage.removeItem("token");
    // this.user.checkToken();
    console.log(this.userInfo)
  }

  ngOnInit(){
    this.fetchUser();
  }
  
  fetchUser(){
    this.user.getUser().subscribe({
      next: resp => this.userInfo = resp,
      error: error => console.log(error),
      complete: ()=> {}
    });
  }
}