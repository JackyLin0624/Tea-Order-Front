import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = sessionStorage.getItem('access_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            console.log(newToken);
            sessionStorage.setItem('access_token', newToken);
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            authService.handleUnauthorized();
            return throwError(() => refreshError);
          })
        );
      }
      else if (error.status === 403) {
        authService.toHome();
      }
      return throwError(() => error);
    })
  );
}
