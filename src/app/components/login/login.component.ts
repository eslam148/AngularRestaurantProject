import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../models/login-dto';
import { ResponseStatus } from '../../models/response-status.enum';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnDestroy {
  loginData: LoginDTO = {
    email: '',
    password: ''
  };

  // UI State
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  rememberMe: boolean = false;

  private destroy$ = new Subject<void>();

  // Demo account credentials
  private demoAccounts = {
    customer: { email: 'customer@demo.com', password: 'demo123' },
    admin: { email: 'admin@demo.com', password: 'admin123' },
    delivery: { email: 'delivery@demo.com', password: 'delivery123' }
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success && response.data) {
            this.successMessage = 'Login successful! Redirecting...';

            // Store remember me preference
            if (this.rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            }

            // The auth service will handle token storage and redirection
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          } else {
            this.errorMessage = response.message || 'Login failed';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'An error occurred during login';
          console.error('Login error:', error);
          this.isLoading = false;
        }
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clearError(): void {
    this.errorMessage = '';
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality will be implemented soon!');
  }

  loginAsDemo(role: 'customer' | 'admin' | 'delivery'): void {
    if (this.isLoading) return;

    const demoAccount = this.demoAccounts[role];
    this.loginData = { ...demoAccount };
    this.onSubmit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
