import { Component, HostListener, effect, inject } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { Router, RouterModule } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('changeRoute', [
      state(
        'unselectd',
        style({
          backgroundColor: 'black',
          borderBottom: '1px solid black',
        })
      ),
      state(
        'selected',
        style({
          backgroundColor: 'red',
        })
      ),
      transition('left => selected', animate('1s')),
      transition(
        '* => selected',
        animate('1s ease-out', style({ transform: 'translateX(-80%)' }))
      ),
      transition(
        'selected => *',
        animate('1s ease-out', style({ transform: 'translateX(80%)' }))
      ),
      transition('selected => left', animate('1s')),
    ]),
  ],
})
export class HeaderComponent {
  private user: UserService = inject(UserService);
  private readonly router: Router = inject(Router);

  first = 'selectd';
  second = 'unselectd';
  isLogged = false;
  isAdmin = false;
  showMenuBtn = true;

  route1() {
    this.first = 'unselectd';
    this.second = 'selected';
  }
  route2() {
    this.second = 'unselectd';
    this.first = 'selected';
  }


  constructor() {
    this.user.checkToken();
    this.checkScreenSize();
    effect(() => (this.isLogged = this.user.isLogged()));
    effect(() => (this.isAdmin = this.user.isAdmin()));
  }

  logOut() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.user.checkToken();
    }
  }

  onRouteChange(): void {
    this.router.navigateByUrl("/profile");
  }

  @HostListener('window:resize', [])
  checkScreenSize() {
    if (window.innerWidth >= 900) {
      this.showMenuBtn = true;
    } else {
      this.showMenuBtn = false;
    }
  }
}
