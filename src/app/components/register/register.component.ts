import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterDTO } from '../../models/register-dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  registerData: RegisterDTO = {
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    role: 'Customer' // Default role
  };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.authService.register(this.registerData).subscribe({
      next: (success) => {
        if (success) {
          // Registration successful, redirect to login
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}
