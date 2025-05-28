import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ResponseStatus } from '../models/response-status.enum';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  let request = req;

  // Add authorization header if token exists
  if (token && !req.url.includes('/login') && !req.url.includes('/register')) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === ResponseStatus.Unauthorized && !req.url.includes('/login')) {
        // Token expired or invalid
        const refreshToken = authService.getRefreshToken();
        if (refreshToken && !req.url.includes('/refresh-token')) {
          return handleRefreshToken(req, next, authService, router);
        } else {
          authService.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};

function handleRefreshToken(originalReq: any, next: any, authService: AuthService, router: Router) {
  return authService.refreshToken({
    token: authService.getToken()!,
    refreshToken: authService.getRefreshToken()!
  }).pipe(
    switchMap((response: any) => {
      if (response.status === ResponseStatus.Success) {
        authService.setTokens(response.data, authService.getRefreshToken()!);
        const newRequest = originalReq.clone({
          setHeaders: {
            Authorization: `Bearer ${response.data}`
          }
        });
        return next(newRequest);
      }
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Token refresh failed'));
    }),
    catchError(() => {
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Token refresh failed'));
    })
  );
}
