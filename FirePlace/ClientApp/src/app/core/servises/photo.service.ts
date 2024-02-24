import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  private http: HttpClient = inject(HttpClient);

  url = "http://localhost:5157/Photo";

  addPhoto(request: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    })
    const body = request;
    return this.http.post(`${this.url}/AddPhoto`, body,{headers});
  }

  getCategories(name: string){
    let params = new HttpParams();
    params = params.append("name",name);
    return this.http.get(`${this.url}/SearchCategory`,{params});
  }

  
}
