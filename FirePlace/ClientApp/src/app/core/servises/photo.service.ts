import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  private http: HttpClient = inject(HttpClient);

  url = "http://localhost:5157/Photo";

  addPhoto(request: any){
    const body = {
      base64String: request.photo,
      lat: request.lat,
      lng: request.lng,
      categories: request.categories 
    }
    return this.http.post(`${this.url}/AddPhoto`, body )
  }

  
}
