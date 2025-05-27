import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderDTO, OrderStatus } from '../../models/order-dto';
import { ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class OrderListComponent implements OnInit {
  orders: OrderDTO[] = [];
  loading = false;
  error: string | null = null;
  OrderStatus = OrderStatus; // Make enum available in template

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getAllOrders()
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.orders = response.data.sort((a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load orders. Please try again later.';
          console.error('Error loading orders:', error);
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
