import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();
  let authReq = req;

  if (currentUser) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-jwt-token-${currentUser.id}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      } else if (error.status === 403) {
        router.navigate(['/access-denied'], {
          queryParams: { attemptedUrl: router.url },
        });
      }
      return throwError(() => error);
    })
  );
};
