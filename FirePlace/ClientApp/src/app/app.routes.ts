import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    { path: 'log-in', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '',   redirectTo: 'log-in', pathMatch: 'full' }, // redirect to 'log-in'
    { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
  ];
