import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
      CommonModule, 
      RouterOutlet, 
      HeaderComponent
    ]
})
export class AppComponent {
  title = 'FirePlace';
  display: boolean = true;
  
  constructor(router: Router) {
   router.events.subscribe(x=>{
    if (x instanceof NavigationEnd) {
      if(x.url == '/log-in' || x.url == '/register'){
        this.display = false;
      } else{
        this.display = true;
      }
    }
   }) 
  }
}
