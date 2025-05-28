import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    public i18nService: SimpleI18nService,
    private authService: AuthService,
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    return this.registerForm.password === this.registerForm.confirmPassword;
  }

  validateForm(): boolean {
    // Clear previous messages
    this.errorMessage = '';

    // Check if all required fields are filled
    if (!this.registerForm.firstName || !this.registerForm.lastName ||
        !this.registerForm.email || !this.registerForm.phone ||
        !this.registerForm.password || !this.registerForm.confirmPassword) {
      this.errorMessage = this.i18nService.translate('auth.register.error.required') || 'All fields are required';
      return false;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerForm.email)) {
      this.errorMessage = this.i18nService.translate('form.email.invalid') || 'Please enter a valid email address';
      return false;
    }

    // Check password length
    if (this.registerForm.password.length < 8) {
      this.errorMessage = this.i18nService.translate('form.password.minLength') || 'Password must be at least 8 characters';
      return false;
    }

    // Check if passwords match
    if (!this.passwordsMatch()) {
      this.errorMessage = this.i18nService.translate('auth.register.error.passwordMismatch') || 'Passwords do not match';
      return false;
    }

    // Check if terms are agreed
    if (!this.registerForm.agreeToTerms) {
      this.errorMessage = this.i18nService.translate('auth.register.error.termsRequired') || 'You must agree to the Terms and Conditions';
      return false;
    }

    return true;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Check if email already exists
      const existingUsers = this.mockDataService.getMockUsers();
      const emailExists = existingUsers.some(user => user.email === this.registerForm.email);

      if (emailExists) {
        this.errorMessage = this.i18nService.translate('auth.register.error.emailExists') || 'An account with this email already exists';
        this.isLoading = false;
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new user data
      const userData = {
        firstName: this.registerForm.firstName,
        lastName: this.registerForm.lastName,
        email: this.registerForm.email,
        phone: this.registerForm.phone,
        role: UserRole.CUSTOMER
      };

      // Register the user
      this.authService.register(userData).subscribe({
        next: (response) => {
          // Show success message
          this.successMessage = this.i18nService.translate('auth.register.success') || 'Account created successfully! Welcome!';

          // Clear form
          this.registerForm = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false
          };

          // Redirect to customer dashboard after a short delay
          setTimeout(() => {
            this.router.navigate(['/customer']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.errorMessage = 'Registration failed. Please try again.';
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      this.errorMessage = 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
