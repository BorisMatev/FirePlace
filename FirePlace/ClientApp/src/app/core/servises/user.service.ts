import { HttpClient, HttpClientModule } from '@angular/common/http';
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
    return this.http.post(`${this.url}/User/Login`,body);
  }
}
