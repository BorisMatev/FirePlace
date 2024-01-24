import { Component } from '@angular/core';
import { UserService } from '../../core/servises/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(private user: UserService) {
    
  }
  ngOnInit(){
    this.user.getUser().subscribe({
      next: resp => console.log(resp),
      error: error => console.log(error)
    })
  }
}
