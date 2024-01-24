import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  url = "http://localhost:5157"

  login(request: any){
    const body = {
      Username: request.username,
      Password: request.password
    }
    return this.http.post(`${this.url}/User/Login`, body, { responseType:'text' });
  }
  register(request: any){
    const body = {
        ProfilePhoto : request.image,
        Username: request.username,
        Info: request.info,
        Email: request.email,
        Password: request.password
      }
      return this.http.post(`${this.url}/User/Register`,body);
  }
  getUser(){
    return this.http.get(`${this.url}/User/GetUser`);
  }
}
