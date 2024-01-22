import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: 'log-in', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', canActivate:[authGuard], component: HomeComponent },
    { path: '',   redirectTo: 'log-in', pathMatch: 'full' }, // redirect to 'log-in'
    { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
  ];
