import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((error:HttpErrorResponse) => {
      if (!error.ok) {
        messageService.add({ 
          key: 'toast', 
          severity: 'error', 
          summary: 'Грешка', 
          detail: 'Възникна фатална сървърна грешка!' 
        });
      }
      throw error
    })
  );
};
