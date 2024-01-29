import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './User/profile/profile.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomePageComponent },
    { path: 'log-in', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', canActivate:[authGuard], component: HomeComponent },
    { path: 'profile', canActivate:[authGuard], component: ProfileComponent },
    { path: '',   redirectTo: 'log-in', pathMatch: 'full' }, // redirect to 'log-in'
    { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
  ];
