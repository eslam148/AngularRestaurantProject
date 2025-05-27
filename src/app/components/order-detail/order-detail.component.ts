import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderDetailsDto, OrderStatus } from '../../models/order-dto';
import { ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderDetailComponent implements OnInit {
  order: OrderDetailsDto | null = null;
  loading = false;
  error: string | null = null;
  OrderStatus = OrderStatus; // Make enum available in template

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadOrderDetails(id);
    } else {
      this.router.navigate(['/orders']);
    }
  }

  private loadOrderDetails(id: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrderDetails(id)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.order = response.data;
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load order details. Please try again later.';
          console.error('Error loading order details:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  updateStatus(id: number, newStatus: OrderStatus): void {
    this.loading = true;
    this.error = null;

    this.orderService.updateOrderStatus(id, newStatus)
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.loadOrderDetails(id); // Reload order details
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to update order status. Please try again later.';
          console.error('Error updating order status:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'status-pending';
      case OrderStatus.OnTheWay:
        return 'status-on-way';
      case OrderStatus.Delivered:
        return 'status-delivered';
      case OrderStatus.Cancelled:
        return 'status-cancelled';
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
}
