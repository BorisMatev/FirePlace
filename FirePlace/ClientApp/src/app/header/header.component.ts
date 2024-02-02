import { Component, effect, inject } from '@angular/core';
import { UserService } from '../core/servises/user.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  private user = inject(UserService);

  isLogged = false;

  constructor(){
    this.user.checkToken();
    effect(() => this.isLogged = this.user.isLogged());
  }

  asd(){
    console.log(this.isLogged)
  }

}
