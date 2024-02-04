import { Component } from '@angular/core';
import { UserService } from '../../core/servises/user.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(private user: UserService) {
    
  }

  userInfo: UserInfo = {
    uername: "asdasd",
    info: "Here i will talk a lot about me and i will say buch of stupid things !",
    profilePhoto: "",
    photos: []
  };

  ngOnInit(){
    this.user.getUser().subscribe({
      next: resp => {
        this.userInfo.info = (resp as any).info;
        this.userInfo.photos = (resp as any).photos;
        this.userInfo.profilePhoto = (resp as any).profilePhoto;
        this.userInfo.uername = (resp as any).username;
      },
      error: error => console.log(error)
    });
  }
}
export interface UserInfo{
  uername: string,
  info: string,
  profilePhoto: string,
  photos: []
}