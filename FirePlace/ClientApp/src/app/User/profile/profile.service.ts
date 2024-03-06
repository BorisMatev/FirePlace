import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileDataService {
  private readonly user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  get user(): Observable<any> {
    return this.user$.asObservable();
  }

  setUser(newData: any): any {
    this.user$.next(newData);
  }
}
