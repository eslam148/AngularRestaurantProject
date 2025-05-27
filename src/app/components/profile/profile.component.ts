import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CustomerProfileDTO } from '../../models/customer-dto';
import { ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  profile: CustomerProfileDTO | null = null;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  isEditing = false;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.error = null;

    this.customerService.getCurrentProfile()
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.profile = response.data;
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load profile. Please try again later.';
          console.error('Error loading profile:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onEdit(): void {
    this.isEditing = true;
    this.error = null;
    this.successMessage = null;
  }

  onCancel(): void {
    this.isEditing = false;
    this.loadProfile(); // Reload profile to discard changes
  }

  onSubmit(): void {
    if (!this.profile) return;

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.customerService.updateProfile(this.profile)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.successMessage = 'Profile updated successfully';
            this.isEditing = false;
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to update profile. Please try again later.';
          console.error('Error updating profile:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.customerService.deleteProfile()
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            // Handle successful deletion (e.g., logout and redirect)
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to delete profile. Please try again later.';
          console.error('Error deleting profile:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
