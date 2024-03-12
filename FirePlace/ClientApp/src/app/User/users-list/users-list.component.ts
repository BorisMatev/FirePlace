import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../core/services/user.service';
import { PhotoService } from '../../core/services/photo.service';
import { ProfileDataService } from '../profile/profile.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ToggleButtonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  private readonly userServise: UserService = inject(UserService);
  // private readonly photoServise: PhotoService = inject(PhotoService);
  private readonly profileDataService: ProfileDataService = inject(ProfileDataService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  value: string = '';
  checked: boolean = false;
  showNotFound: boolean = false;

  followers: any = [];
  following: any = [];

  changeState() { 
    this.showNotFound = false;
  }

  ngOnInit() {
    this.fetchUsers()
  }

  fetchUsers(): void{
    let username = this.activeRoute.snapshot.paramMap.get('name');

    this.userServise.getFollowers(username!).subscribe({
      next: resp => this.followers = resp,
      error: error => console.log(error)
    })

    this.userServise.getFollowing(username!).subscribe({
      next: resp => this.following = resp,
      error: error => console.log(error)
    })
  }


  openUser(name: string): void {
    this.userServise.getInfoByUsername(name).subscribe({
      next: resp => this.profileDataService.setUser(resp),
      error: error => console.log(error),
      complete: () => this.router.navigate(['/user',name])
    });
  }
  // fetchFollowers() {
  //   this.userServise.getFollowers().subscribe({
  //     next: (resp) => {
  //       this.followers = resp;
  //       this.showNotFound = true;
  //     },
  //     error: () => console.log(),
  //   });
  // }

  // searchPhotosByCategory() {
  //   const body = this.value;
  //   this.photoServise.getPhotosByCategories(body).subscribe({
  //     next: (resp) => console.log(resp),
  //     error: (error) => console.log(error),
  //   });
  // }

}
