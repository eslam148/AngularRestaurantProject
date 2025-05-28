import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Order, OrderStatus } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/order.service';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;

  // Filter options
  selectedStatus: OrderStatus | 'all' = 'all';
  searchQuery = '';
  sortBy: 'date' | 'status' | 'total' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Expose enums to template
  OrderStatus = OrderStatus;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private i18nService: SimpleI18nService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.createMockOrdersIfEmpty();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrders(): void {
    this.loading = true;

    // In a real app, you'd get the customer ID from auth service
    const customerId = 'guest';

    this.orderService.getOrdersByCustomerId(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.loading = false;
        }
      });
  }

  private createMockOrdersIfEmpty(): void {
    // Create mock orders for demonstration if none exist
    if (this.orders.length === 0) {
      this.orderService.createMockOrders();
      this.loadOrders();
    }
  }

  // Filtering and Sorting
  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Sort orders
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'date':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
      }

      return this.sortOrder === 'desc' ? -comparison : comparison;
    });

    this.filteredOrders = filtered;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  }

  // Event handlers
  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Helper methods
  getPaginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'warning',
      [OrderStatus.CONFIRMED]: 'info',
      [OrderStatus.PREPARING]: 'primary',
      [OrderStatus.READY_FOR_PICKUP]: 'info',
      [OrderStatus.OUT_FOR_DELIVERY]: 'success',
      [OrderStatus.DELIVERED]: 'success',
      [OrderStatus.CANCELLED]: 'danger',
      [OrderStatus.REFUNDED]: 'secondary'
    };
    return colors[status] || 'secondary';
  }

  getStatusIcon(status: OrderStatus): string {
    const icons: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'bi-clock',
      [OrderStatus.CONFIRMED]: 'bi-check-circle',
      [OrderStatus.PREPARING]: 'bi-tools',
      [OrderStatus.READY_FOR_PICKUP]: 'bi-bag-check',
      [OrderStatus.OUT_FOR_DELIVERY]: 'bi-truck',
      [OrderStatus.DELIVERED]: 'bi-check-circle-fill',
      [OrderStatus.CANCELLED]: 'bi-x-circle',
      [OrderStatus.REFUNDED]: 'bi-arrow-counterclockwise'
    };
    return icons[status] || 'bi-circle';
  }

  getStatusText(status: OrderStatus): string {
    const texts: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: this.translate('order.status.pending') || 'Pending',
      [OrderStatus.CONFIRMED]: this.translate('order.status.confirmed') || 'Confirmed',
      [OrderStatus.PREPARING]: this.translate('order.status.preparing') || 'Preparing',
      [OrderStatus.READY_FOR_PICKUP]: this.translate('order.status.readyForPickup') || 'Ready for Pickup',
      [OrderStatus.OUT_FOR_DELIVERY]: this.translate('order.status.outForDelivery') || 'Out for Delivery',
      [OrderStatus.DELIVERED]: this.translate('order.status.delivered') || 'Delivered',
      [OrderStatus.CANCELLED]: this.translate('order.status.cancelled') || 'Cancelled',
      [OrderStatus.REFUNDED]: this.translate('order.status.refunded') || 'Refunded'
    };
    return texts[status] || status;
  }

  canTrackOrder(order: Order): boolean {
    return this.orderService.canTrackOrder(order);
  }

  canCancelOrder(order: Order): boolean {
    return this.orderService.canCancelOrder(order);
  }

  canReorder(order: Order): boolean {
    return order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString(this.i18nService.currentLanguage, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString(this.i18nService.currentLanguage, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }

  trackByOrder(index: number, order: Order): string {
    return order.id;
  }

  getItemsPreview(order: Order): string {
    const firstTwoItems = order.items.slice(0, 2).map(item => item.name).join(', ');
    if (order.items.length > 2) {
      return `${firstTwoItems} ${this.translate('orders.andMore') || 'and'} ${order.items.length - 2} ${this.translate('orders.more') || 'more'}`;
    }
    return firstTwoItems;
  }

  getMinValue(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Navigation
  viewOrder(orderId: string): void {
    this.router.navigate(['/customer/order', orderId]);
  }

  trackOrder(orderId: string): void {
    this.router.navigate(['/customer/order', orderId]);
  }

  reorder(order: Order): void {
    this.orderService.reorder(order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newOrder) => {
          if (newOrder) {
            this.router.navigate(['/customer/order', newOrder.id]);
          }
        },
        error: (error) => {
          console.error('Error reordering:', error);
        }
      });
  }

  cancelOrder(order: Order): void {
    const confirmCancel = confirm(
      this.translate('order.cancelConfirm') ||
      'Are you sure you want to cancel this order?'
    );

    if (!confirmCancel) {
      return;
    }

    this.orderService.cancelOrder(order.id, 'Cancelled by customer')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadOrders(); // Refresh the list
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
        }
      });
  }

  goToRestaurants(): void {
    this.router.navigate(['/customer/restaurants']);
  }
}
