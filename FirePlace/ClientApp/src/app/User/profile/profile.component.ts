import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfileDataService } from './profile.service';
import { EMPTY, Observable } from 'rxjs';
import { AsyncPipe} from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ RouterLink, AsyncPipe, SkeletonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private readonly profileDataService: ProfileDataService = inject(ProfileDataService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute)
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  user$: Observable<any> = EMPTY;
  isOwned: boolean = false;


  ngOnInit() {
    this.checkRoute();
    this.fetchUser();
  }

  fetchUser() {
    this.user$ = this.profileDataService.user;
    if (this.isOwned) {
      this.userService.getUser().subscribe({
        next: resp => this.profileDataService.setUser(resp),
        error: error => console.log(error)
      });
    } else{
      let username = this.activeRoute.snapshot.paramMap.get('name');
      this.userService.getInfoByUsername(username!).subscribe({
        next: resp => this.profileDataService.setUser(resp),
        error: error => console.log(error)
      });
    }
  }

  follow(username: string){
    this.userService.followUnfollow(username).subscribe({
      complete: () => {}
    })
  }

  loadFollowers(username: string): void{
    this.router.navigate(['/list',username])
  }

  reviewPhoto(id: number){
    this.router.navigate(['/photo',id])
  }

  checkRoute(): void {
    if (this.router.url == '/profile') {
      this.isOwned = true;
    } else {
      this.isOwned = false;
    }
  }
}