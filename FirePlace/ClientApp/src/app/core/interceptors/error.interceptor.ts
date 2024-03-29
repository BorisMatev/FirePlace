import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error:HttpErrorResponse) => {

      let errorMessage = '';

      if (error.status == 400 || error.status == 404) {
        errorMessage = `${error.error}`;
      }
      else if (error.status == 401 || error.status == 403) {
        errorMessage = 'Нямате достъп до страницата!';
      }
      else if (error.status >= 500) {
        errorMessage = 'Възникна фатална сървърна грешка!';
      }
      else {
        errorMessage = "Неясна грешка";
      }

      messageService.add({ 
        key: 'toast', 
        severity: 'error', 
        summary: 'Грешка', 
        detail: errorMessage 
      });

      throw error
    })
  );
};
