import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDTO } from '../../models/login-dto';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent implements OnDestroy {
  loginData: LoginDTO = {
    email: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.status === 'Success' && response.data) {
            this.authService.setTokens(response.data.token, response.data.refreshToken);
            this.router.navigate(['/']);
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'An error occurred during login';
          console.error('Login error:', error);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
