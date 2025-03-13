import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {

    return authService.refreshToken().pipe(
      map(success => {
        if (success) {
          return true;
        } else {
          router.navigate(['']);
          authService.openLoginDialog();
          return false;
        }
      }),
      catchError(() => {
        router.navigate(['']);
        authService.openLoginDialog();
        return of(false);
      })
    );
  }
};
