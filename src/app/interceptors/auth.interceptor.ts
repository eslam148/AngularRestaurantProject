import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          const refreshToken = this.authService.getRefreshToken();
          if (refreshToken) {
            return this.handleRefreshToken(request, next);
          } else {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => error);
      })
    );
  }

  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.refreshToken({
      token: this.authService.getToken()!,
      refreshToken: this.authService.getRefreshToken()!
    }).pipe(
      switchMap(response => {
        if (response.status === 'Success') {
          this.authService.setTokens(response.data, this.authService.getRefreshToken()!);
          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${response.data}`
            }
          });
          return next.handle(newRequest);
        }
        this.authService.logout();
        this.router.navigate(['/login']);
        return throwError(() => new Error('Token refresh failed'));
      })
    );
  }
}
