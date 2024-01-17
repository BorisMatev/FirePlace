import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function jwtInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  let token = localStorage.getItem('token');
  if (token) {
    token = JSON.parse(token);
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
  return next(req);
}