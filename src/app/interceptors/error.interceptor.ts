import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { ResponseStatus } from '../models/response-status.enum';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      // Handle different error types
      switch (error.status) {
        case 0:
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case ResponseStatus.BadRequest:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case ResponseStatus.Unauthorized:
          errorMessage = 'Authentication required. Please log in.';
          // Don't show notification for 401 as auth interceptor handles it
          return throwError(() => error);
        case ResponseStatus.Forbidden:
          errorMessage = 'Access denied. You don\'t have permission to perform this action.';
          break;
        case ResponseStatus.NotFound:
          errorMessage = 'The requested resource was not found.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case ResponseStatus.InternalServerError:
          errorMessage = 'Server error. Please try again later.';
          break;
        case ResponseStatus.ServiceUnavailable:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }

      // Show error notification
      notificationService.showError(errorMessage);

      // Log error for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: error.message,
        url: error.url,
        error: error.error
      });

      return throwError(() => error);
    })
  );
};
