import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let jwt = localStorage.getItem('token');
  jwt = JSON.stringify(jwt);
  let jwtData = jwt.split('.')[1];
  let decodedJwtJsonData = window.atob(jwtData);
  let decodedJwtData = JSON.parse(decodedJwtJsonData);
  let role = decodedJwtData.role;
  if (role === "Admin") {
    return true;
  } else {
    router.navigate(['/welcome']);
    return false;
  }
};
