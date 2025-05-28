import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { MockDataService } from '../../../../core/services/mock-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dashboardStats: any[] = [];
  recentOrders: any[] = [];
  recentActivity: any[] = [];

  constructor(
    public i18nService: SimpleI18nService,
    private mockDataService: MockDataService
  ) {
    this.initializeData();
  }

  private initializeData(): void {
    // Get stats from mock data service and add translations
    this.dashboardStats = this.mockDataService.getAdminDashboardStats().map(stat => ({
      ...stat,
      title: this.i18nService.translate(`admin.stats.${stat.title.toLowerCase().replace(/\s+/g, '')}`) || stat.title
    }));

    this.recentOrders = this.mockDataService.getAdminRecentOrders();
    this.recentActivity = this.mockDataService.getAdminRecentActivity();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'delivered': 'status-delivered',
      'preparing': 'status-preparing',
      'out_for_delivery': 'status-out-for-delivery',
      'confirmed': 'status-confirmed',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-default';
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'order': '📋',
      'restaurant': '🏪',
      'delivery': '🚚',
      'user': '👤'
    };
    return icons[type] || '📄';
  }
}
