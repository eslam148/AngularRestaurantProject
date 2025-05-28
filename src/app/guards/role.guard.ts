import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const requiredRole = route.data['role'];
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    notificationService.showError(
      'You do not have permission to access this page.',
      'Access Denied'
    );
    
    // Redirect to appropriate dashboard based on user role
    const userRole = authService.getUserRole();
    switch (userRole?.toLowerCase()) {
      case 'admin':
        router.navigate(['/admin/dashboard']);
        break;
      case 'delivery':
      case 'deliverydriver':
        router.navigate(['/delivery/dashboard']);
        break;
      default:
        router.navigate(['/customer/menu']);
        break;
    }
    return false;
  }

  return true;
};
