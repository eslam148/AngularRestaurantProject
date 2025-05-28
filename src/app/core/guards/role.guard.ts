import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkRole(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkRole(childRoute);
  }

  private checkRole(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return this.authService.isAuthenticated$;
    }

    return this.authService.user$.pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return false;
        }

        if (requiredRoles.includes(user.role)) {
          return true;
        } else {
          // Redirect based on user role
          this.redirectToUserDashboard(user.role);
          return false;
        }
      })
    );
  }

  private redirectToUserDashboard(role: UserRole): void {
    switch (role) {
      case UserRole.CUSTOMER:
        this.router.navigate(['/customer']);
        break;
      case UserRole.ADMIN:
        this.router.navigate(['/admin']);
        break;
      case UserRole.DELIVERY:
        this.router.navigate(['/delivery']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
