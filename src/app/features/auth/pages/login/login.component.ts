import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Expose UserRole enum to template
  UserRole = UserRole;

  loginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  errorMessage = '';
  showPassword = false;
  mockCredentials: any[] = [];

  constructor(
    public i18nService: SimpleI18nService,
    private mockDataService: MockDataService,
    private router: Router
  ) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.mockCredentials = this.mockDataService.getAuthMockData().loginCredentials;
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = this.i18nService.translate('auth.login.error.required') || 'Email and password are required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check mock credentials
    const user = this.mockCredentials.find(cred =>
      cred.email === this.loginForm.email && cred.password === this.loginForm.password
    );

    if (user) {
      // Find the full user data
      const fullUser = this.mockDataService.getMockUsers().find(u => u.email === user.email);
      if (fullUser) {
        this.mockDataService.setCurrentUser(fullUser);

        // Redirect based on role
        switch (user.role) {
          case UserRole.ADMIN:
            this.router.navigate(['/admin']);
            break;
          case UserRole.DELIVERY:
            this.router.navigate(['/delivery']);
            break;
          case UserRole.CUSTOMER:
          default:
            this.router.navigate(['/customer']);
            break;
        }
      }
    } else {
      this.errorMessage = this.i18nService.translate('auth.login.error.invalid') || 'Invalid email or password';
    }

    this.isLoading = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  fillMockCredentials(role: UserRole): void {
    const cred = this.mockCredentials.find(c => c.role === role);
    if (cred) {
      this.loginForm.email = cred.email;
      this.loginForm.password = cred.password;
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
