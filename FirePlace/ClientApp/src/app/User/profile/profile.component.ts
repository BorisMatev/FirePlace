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

  userInfo: any;

  ngOnInit(){
    this.user.getUser().subscribe({
      next: resp => this.userInfo = resp,
      error: error => console.log(error)
    });
  }
}
