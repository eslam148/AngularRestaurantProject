import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isOnline = true;
  todayStats: any[] = [];
  pendingOrders: any[] = [];
  earningsData: any = {};

  constructor(
    public i18nService: SimpleI18nService,
    private mockDataService: MockDataService
  ) {
    this.initializeData();
  }

  private initializeData(): void {
    // Get stats from mock data service and add translations
    this.todayStats = this.mockDataService.getDeliveryDashboardStats().map(stat => ({
      ...stat,
      title: this.i18nService.translate(`delivery.stats.${stat.title.toLowerCase().replace(/\s+/g, '').replace("'", '')}`) || stat.title
    }));

    this.pendingOrders = this.mockDataService.getDeliveryPendingOrders();
    this.earningsData = this.mockDataService.getDeliveryEarningsData();
  }

  toggleOnlineStatus(): void {
    this.isOnline = !this.isOnline;
  }

  acceptOrder(orderId: string): void {
    console.log('Accepting order:', orderId);
    // Remove order from pending list
    this.pendingOrders = this.pendingOrders.filter(order => order.id !== orderId);
  }

  declineOrder(orderId: string): void {
    console.log('Declining order:', orderId);
    // Remove order from pending list
    this.pendingOrders = this.pendingOrders.filter(order => order.id !== orderId);
  }

  getPriorityClass(priority: string): string {
    const priorityClasses: { [key: string]: string } = {
      'high': 'priority-high',
      'medium': 'priority-medium',
      'low': 'priority-low'
    };
    return priorityClasses[priority] || 'priority-medium';
  }

  getStatusText(): string {
    return this.isOnline
      ? this.i18nService.translate('delivery.status.online') || 'Online'
      : this.i18nService.translate('delivery.status.offline') || 'Offline';
  }
}
