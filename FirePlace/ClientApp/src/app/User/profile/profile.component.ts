import { Component } from '@angular/core';
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
  constructor(private user: UserService) {
    
  }

  userInfo: UserInfo = {
    uername: '',
    info: '',
    photosCount: 0,
    followersCount: 0,
    followingCount: 0,
    profilePhoto: '',
    photos: []
  };

  ngOnInit(){
    this.user.getUser().subscribe({
      next: resp => {
        this.userInfo = {
          info: (resp as any).info,
          photos: (resp as any).photos,
          uername: (resp as any).username,
          profilePhoto: (resp as any).profilePhoto,
          photosCount: (resp as any).photosCount ? null: 0,
          followersCount: (resp as any).followersCount ? null: 0,
          followingCount: (resp as any).followingCount ? null: 0
        }
      },
      error: error => console.log(error)
    });
  }
}
export interface UserInfo{
  uername: string,
  info: string,
  photosCount: number | null,
  followersCount: number | null,
  followingCount: number | null,
  profilePhoto: string,
  photos: [] | null
}