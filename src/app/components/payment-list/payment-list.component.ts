import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { PaymentDTO, PaymentMethod, PaymentStatus } from '../../models/payment-dto';
import { ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class PaymentListComponent implements OnInit {
  payments: PaymentDTO[] = [];
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  PaymentStatus = PaymentStatus;
  PaymentMethod = PaymentMethod;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  private loadPayments(): void {
    this.loading = true;
    this.error = null;

    this.paymentService.getAllPayments()
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.payments = response.data.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load payments. Please try again later.';
          console.error('Error loading payments:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  getStatusClass(status: PaymentStatus): string {
    switch (status) {
      case PaymentStatus.Completed:
        return 'status-completed';
      case PaymentStatus.Pending:
        return 'status-pending';
      case PaymentStatus.Failed:
        return 'status-failed';
      case PaymentStatus.Refunded:
        return 'status-refunded';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
