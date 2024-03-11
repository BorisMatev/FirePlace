import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './User/profile/profile.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { PhotoComponent } from './User/photo/photo.component';
import { AddPhotoComponent } from './User/add-photo/add-photo.component';
import { UsersListComponent } from './User/users-list/users-list.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'log-in', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', canActivate: [authGuard], component: HomeComponent },
  { path: 'list/:name', canActivate: [authGuard], component: UsersListComponent },
  { path: 'photo', canActivate: [authGuard], component: PhotoComponent },
  { path: 'user/:name', canActivate: [authGuard], component: ProfileComponent },
  { path: 'profile', canActivate: [authGuard], component: ProfileComponent },
  { path: 'add-photo', canActivate: [authGuard], component: AddPhotoComponent },
  { path: 'admin', canActivate: [authGuard, adminGuard], component: AdminComponent },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // redirect to 'log-in'
  { path: '**', component: WelcomePageComponent },  // Wildcard route for a 404 page
];
