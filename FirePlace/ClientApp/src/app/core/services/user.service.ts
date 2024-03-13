import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  private router = inject(Router);

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
    return this.http.post(`${this.url}/Register`, body);
  }

  getUsername(){
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

  followUser(username: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('username', username);
    return this.http.post<any>(`${this.url}/FollowUser`, { params })
  }

  checkToken() {
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
