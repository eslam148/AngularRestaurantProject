import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, switchMap, interval } from 'rxjs';
import { Order, OrderStatus, OrderTimeline } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/order.service';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private refreshInterval$ = new Subject<void>();

  order: Order | null = null;
  loading = false;
  cancelling = false;
  reordering = false;

  // Expose enums to template
  OrderStatus = OrderStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private i18nService: SimpleI18nService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refreshInterval$.next();
    this.refreshInterval$.complete();
  }

  private loadOrder(): void {
    this.loading = true;

    this.route.params.pipe(
      switchMap(params => this.orderService.getOrderById(params['id'])),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;

        if (!order) {
          // Order not found, redirect to orders list
          this.router.navigate(['/customer/orders']);
        }
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
        this.router.navigate(['/customer/orders']);
      }
    });
  }

  private startAutoRefresh(): void {
    // Auto-refresh order status every 30 seconds for active orders
    interval(30000).pipe(
      takeUntil(this.refreshInterval$),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.order && this.orderService.canTrackOrder(this.order)) {
        this.refreshOrder();
      }
    });
  }

  private refreshOrder(): void {
    if (!this.order) return;

    this.orderService.getOrderById(this.order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(order => {
        if (order) {
          this.order = order;
        }
      });
  }

  // Order actions
  cancelOrder(): void {
    if (!this.order || !this.orderService.canCancelOrder(this.order)) {
      return;
    }

    const confirmCancel = confirm(
      this.translate('order.cancelConfirm') ||
      'Are you sure you want to cancel this order?'
    );

    if (!confirmCancel) {
      return;
    }

    this.cancelling = true;

    this.orderService.cancelOrder(this.order.id, 'Cancelled by customer')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedOrder) => {
          if (updatedOrder) {
            this.order = updatedOrder;
          }
          this.cancelling = false;
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.cancelling = false;
        }
      });
  }

  reorder(): void {
    if (!this.order) return;

    this.reordering = true;

    this.orderService.reorder(this.order.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newOrder) => {
          this.reordering = false;
          if (newOrder) {
            // Navigate to the new order detail page
            this.router.navigate(['/customer/order', newOrder.id]);
          }
        },
        error: (error) => {
          console.error('Error reordering:', error);
          this.reordering = false;
        }
      });
  }

  // Helper methods
  getOrderProgress(): { current: number; total: number; percentage: number } {
    if (!this.order) {
      return { current: 0, total: 5, percentage: 0 };
    }
    return this.orderService.getOrderProgress(this.order);
  }

  getDeliveryTimeRemaining(): string {
    if (!this.order) return '';
    return this.orderService.getDeliveryTimeRemaining(this.order);
  }

  canCancelOrder(): boolean {
    if (!this.order) return false;
    return this.orderService.canCancelOrder(this.order);
  }

  canTrackOrder(): boolean {
    if (!this.order) return false;
    return this.orderService.canTrackOrder(this.order);
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

  formatDate(date: Date): string {
    return date.toLocaleDateString(this.i18nService.currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString(this.i18nService.currentLanguage, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString(this.i18nService.currentLanguage, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  trackByTimelineItem(index: number, item: OrderTimeline): string {
    return `${item.status}-${item.timestamp.getTime()}`;
  }

  trackByOrderItem(index: number, item: any): string {
    return item.id;
  }

  hasTimelineStatus(status: OrderStatus): boolean {
    if (!this.order) return false;
    return this.order.timeline.some(t => t.status === status);
  }

  getTimelineItem(status: OrderStatus): any {
    if (!this.order) return null;
    return this.order.timeline.find(t => t.status === status);
  }

  getCustomizationSummary(item: any): string {
    if (!item.customizations || item.customizations.length === 0) {
      return '';
    }

    const summaries: string[] = [];
    item.customizations.forEach((customization: any) => {
      // In a real app, you'd resolve customization IDs to names
      summaries.push(`${customization.name}: ${customization.options.join(', ')}`);
    });

    return summaries.join(' • ');
  }

  // Navigation
  goToOrders(): void {
    this.router.navigate(['/customer/orders']);
  }

  goToRestaurant(): void {
    if (this.order) {
      this.router.navigate(['/customer/restaurant', this.order.restaurantId]);
    }
  }
}
