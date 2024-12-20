import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly router = inject(Router);

  url = 'http://localhost:5157/User';
  isLogged = signal<boolean>(false);
  isAdmin = signal<boolean>(false);

  login(request: any) {
    const body = {
      Username: request.username,
      Password: request.password,
    };
    return this.http.post(`${this.url}/Login`, body, { responseType: 'text' });
  }
  register(request: any) {
    const body = {
      ProfilePhoto: request.image,
      Username: request.username,
      Info: request.info,
      Email: request.email,
      Password: request.password,
    };
    return this.http.post(`${this.url}/Register`, body, { responseType: 'text' });
  }

  getUsername() {
    return this.http.get<string>(`${this.url}/GetUsername`);
  }

  getUser() {
    return this.http.get(`${this.url}/GetUserByJwt`);
  }

  getInfoByUsername(username: string) {
    let params = new HttpParams().set('name', username);
    params = params.append('username', username);
    return this.http.get(`${this.url}/GetUserByUsername`, { params });
  }

  getUsersByUsername(username: string) {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get(`${this.url}/GetUsersBySearchedName`, { params });
  }

  getSettingsUser() {
    return this.http.get(`${this.url}/GetUserSettings`);
  }

  getFollowers(username: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get<any>(`${this.url}/GetFollowers`, { params })
  }

  getFollowing(username: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.get<any>(`${this.url}/GetFollowing`, { params })
  }

  updateUsername(req: any): Observable<any> {
    const body = {
      value: req
    }
    return this.http.put<any>(`${this.url}/ChangeUsername`, body)
  }

  updatePassword(req: any): Observable<any> {
    const body = {
      newPassword: req.newPassword,
      oldPassword: req.oldPassword
    }
    return this.http.put<any>(`${this.url}/ChangePassword`, body)
  }

  updatePhoto(req: any): Observable<any> {
    const body = {
      value: req
    }
    return this.http.put<any>(`${this.url}/ChangePhoto`, body)
  }

  followUnfollow(username: string): Observable<any> {
    const body = {
      username: username
    }
    return this.http.post<any>(`${this.url}/FollowAndUnfollow`, body)
  }

  delete(req: string) {
    const body = {
      value: req
    }
    return this.http.delete<any>(`${this.url}/Delete`, { body })
  }

  checkToken(): void {
    if (localStorage.getItem('token')) {
      this.isLogged.set(true);
      this.isAdmin.set(
        this.chechAdmin()
      );
    } else {
      this.isLogged.set(false);
      this.router.navigate(['/welcome']);
    }
  }

  chechAdmin(): boolean {
    let jwt = localStorage.getItem('token');
    jwt = JSON.stringify(jwt);
    let jwtData = jwt.split('.')[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    let role = decodedJwtData.role;
    if (role === "Admin") {
      return true;
    } else {
      return false;
    }
  }
}
