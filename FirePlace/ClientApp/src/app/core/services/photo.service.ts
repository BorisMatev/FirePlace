import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() { }

  private http: HttpClient = inject(HttpClient);

  url = 'http://localhost:5157/Photo';

  addPhoto(request: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      accept: 'text/plain',
    });
    const body = {
      base64String: request.base64String,
      lat: request.lat,
      lng: request.lng,
      categories: request.categories,
    };
    return this.http.post(`${this.url}/AddPhoto`, body, { headers });
  }

  getAllCategories(): Observable<any> {
    return this.http.get<any>(`${this.url}/GetAllCategory`);
  }

  getCategories(name: string) {
    let params = new HttpParams();
    params = params.append('name', name);
    return this.http.get(`${this.url}/SearchCategory`, { params });
  }

  getById(id: number) {
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.get(`${this.url}/GetPhotoById`, { params });
  }

  getPhotosByCategories(name: string) {
    let params = new HttpParams();
    params = params.append('category', name);
    return this.http.get(`${this.url}/GetPhotosByCategory`, { params });
  }
  
  like(id: number): Observable<any>{
    const body = {
      photoId: id
    }
    return this.http.post(`${this.url}/Like`, body)
  }
}
