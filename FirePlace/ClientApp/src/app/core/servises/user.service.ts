import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  url = "http://localhost:5157/User";
  isLogged = signal<boolean>(false);

  checkToken(){
    if (localStorage.getItem('token')) {
      this.isLogged.set(true);
    } else {
      this.isLogged.set(false);
    }
  }

  login(request: any){
    const body = {
      Username: request.username,
      Password: request.password
    }
    return this.http.post(`${this.url}/Login`, body, { responseType:'text' });
  }
  register(request: any){
    const body = {
        ProfilePhoto : request.image,
        Username: request.username,
        Info: request.info,
        Email: request.email,
        Password: request.password
      }
      return this.http.post(`${this.url}/Register`,body);
  }
  getUser(){
    return this.http.get(`${this.url}/GetUserByJwt `,);
  }
  getUserByUsername(username: string){
    let params = new HttpParams();
    params = params.append("username",username);
    return this.http.get(`${this.url}/GetUsersBySearchedName`,{params})
  }
}
