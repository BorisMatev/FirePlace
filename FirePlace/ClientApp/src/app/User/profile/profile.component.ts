import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { ProfileDataService } from './profile.service';
import { EMPTY, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, RouterLink, NgIf, AsyncPipe, SkeletonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private readonly profileDataService: ProfileDataService = inject(ProfileDataService);
  private readonly router: Router = inject(Router);
  private readonly userService: UserService = inject(UserService);

  user$: Observable<any> = EMPTY;
  isOwned: boolean = false;

  ngOnInit() {
    this.fetchUser();
    this.checkRoute();
  }

  fetchUser() {
    if (this.isOwned) {
      this.userService.getUser().subscribe((resp: any) => {
        this.profileDataService.setUser(resp);
      });
    }
    this.user$ = this.profileDataService.user;
  }

  checkRoute(): void {
    if (this.router.url == '/profile') {
      this.isOwned = true;
    } else {
      this.isOwned = false;
    }
  }
}