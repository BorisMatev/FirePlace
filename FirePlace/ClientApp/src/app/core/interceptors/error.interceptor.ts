import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error:HttpErrorResponse) => {

      let errorMessage = '';

      if (error.status <= 400 || error.status < 500) {
        errorMessage = `${error.error}`;
      }
      else if (error.status >= 500) {
        errorMessage = 'Възникна фатална сървърна грешка!';
      }
      
      if (errorMessage == "") {
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
