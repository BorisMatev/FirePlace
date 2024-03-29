import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ToggleButtonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {

  private readonly userServise: UserService = inject(UserService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  value: string = '';
  checked: boolean = false;
  showNotFound: boolean = false;

  ownerUsername: string = "";
  followers: any = [];
  following: any = [];

  changeState() { 
    this.showNotFound = false;
  }
  
  ngOnInit() {
    this.ownerUsername = localStorage.getItem("name")!;
    this.fetchUsers();
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
    if (name == this.ownerUsername) {
      this.router.navigate(['/profile']);
    } else{
      this.router.navigate(['/user/',name]);
    }
  }

}
