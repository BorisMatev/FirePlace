import { Component, HostListener, effect, inject } from '@angular/core';
import { UserService } from '../core/servises/user.service';
import { RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations:[
    trigger('changeRoute',[
      state("unselectd", style({
        backgroundColor: 'black',
        borderBottom: '1px solid black'
      })),
      state("selected", style({
        backgroundColor: 'red'
      })),
      transition('left => selected', animate('1s')),
      transition('* => selected', animate('1s ease-out', style({transform: 'translateX(-80%)'}))),
      transition('selected => *', animate('1s ease-out', style({transform: 'translateX(80%)'}))),
      transition('selected => left', animate('1s'))
    ])
  ]
})
export class HeaderComponent {

  first = "selectd";
  second = 'unselectd';
  route1(){
    this.first = 'unselectd';
    this.second = "selected";
  }

  route2(){
    this.second = 'unselectd';
    this.first = "selected";
  }
  private user = inject(UserService);

  isLogged = false;
  showMenuBtn = true;

  constructor(){
    this.user.checkToken();
    effect(() => this.isLogged = this.user.isLogged());
  }

  logOut(){
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      this.user.checkToken();
    }
  }

  @HostListener("window:resize", []) 
  updateDays() {
    if (window.innerWidth >= 900) {
      this.showMenuBtn = true; 
    } else {
      this.showMenuBtn = false;
    }
  }
}
