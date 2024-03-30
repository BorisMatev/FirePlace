import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private readonly http: HttpClient = inject(HttpClient);

    url = 'http://localhost:5157/Admin';

    get User(): Observable<any> {
        return this.http.get<any>(`${this.url}/GetAll`);
    }

    addCategory(name: string): Observable<any> {
        return this.http.post<any>(`${this.url}/AddCategory`, { name })
    }

    changeRole(id: number): Observable<any> {
        return this.http.put<any>(`${this.url}/ChangeRole`, { id })
    }

    delete(id: number) {
        const body = {
            id: id
        }
        return this.http.delete(`${this.url}/Delete`, { body })
    }

}