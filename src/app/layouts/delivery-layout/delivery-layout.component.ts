import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil, interval } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DeliveryService } from '../../services/delivery.service';
import { LayoutService, LayoutType } from '../../services/layout.service';
import {
  DeliveryStatsDto,
  OrderForDeliveryDto,
  LocationDto,
  NotificationDto,
  OrderStatus,
  EarningsDto
} from '../../models/delivery-dto';
import { ResponseStatus } from '../../models/response';
import { NavigationBarComponent } from '../../shared/components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-delivery-layout',
  templateUrl: './delivery-layout.component.html',
  styleUrls: ['./delivery-layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationBarComponent]
})
export class DeliveryLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  // Layout State
  LayoutType = LayoutType;
  currentLayout: LayoutType = LayoutType.DELIVERY;

  isAuthenticated = false;
  currentUser: any = null;
  isOnline = false;
  currentLocation: string = 'Getting location...';
  isLoading = true;
  isDesktop = false;

  // Navigation Items for Delivery Layout
  navigationItems = [
    { label: 'Dashboard', route: '/delivery/dashboard', icon: '🏠', badge: null as string | null },
    { label: 'Orders', route: '/delivery/orders', icon: '📦', badge: null as string | null },
    { label: 'Navigation', route: '/delivery/navigation', icon: '🗺️', badge: null as string | null },
    { label: 'Earnings', route: '/delivery/earnings', icon: '💰', badge: null as string | null },
    { label: 'Profile', route: '/delivery/profile', icon: '👤', requiresAuth: true, badge: null as string | null }
  ];

  stats: DeliveryStatsDto = {
    todayDeliveries: 0,
    pendingOrders: 0,
    completedToday: 0,
    earnings: 0,
    rating: 0,
    totalDistance: 0,
    averageDeliveryTime: 0,
    onTimeDeliveryRate: 0
  };

  orders: OrderForDeliveryDto[] = [];
  notifications: NotificationDto[] = [];
  earnings: EarningsDto | null = null;
  locationError: string | null = null;

  quickActions = [
    { label: 'My Orders', route: '/delivery/orders', icon: '📦', color: 'primary' },
    { label: 'Navigation', route: '/delivery/navigation', icon: '🗺️', color: 'info' },
    { label: 'Earnings', route: '/delivery/earnings', icon: '💰', color: 'success' },
    { label: 'Support', route: '/delivery/support', icon: '🆘', color: 'warning' }
  ];

  constructor(
    private authService: AuthService,
    private deliveryService: DeliveryService,
    private layoutService: LayoutService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Layout Switcher Methods
  switchToCustomerLayout(): void {
    this.layoutService.setCustomerLayout();
  }

  switchToAdminLayout(): void {
    this.layoutService.setAdminLayout();
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngAfterViewInit(): void {
    // تأخير فحص حجم الشاشة حتى بعد تهيئة العرض
    setTimeout(() => {
      this.checkScreenSize();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async initializeComponent(): Promise<void> {
    try {
      this.isLoading = true;

      // Subscribe to authentication state
      this.authService.isAuthenticated$
        .pipe(takeUntil(this.destroy$))
        .subscribe(isAuth => {
          this.isAuthenticated = isAuth;
          if (isAuth) {
            this.currentUser = this.authService.getCurrentUser();
            this.loadInitialData();
          } else {
            this.currentUser = null;
            this.router.navigate(['/login']);
          }
        });

      // Subscribe to delivery service observables
      this.subscribeToDeliveryData();

      // Get current location
      await this.getCurrentLocation();

    } catch (error) {
      console.error('Error initializing component:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private subscribeToDeliveryData(): void {
    // Subscribe to stats updates
    this.deliveryService.stats$
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.stats = stats;
        this.updateNavigationBadges();
      });

    // Subscribe to orders updates
    this.deliveryService.orders$
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.orders = orders;
      });

    // Subscribe to notifications
    this.deliveryService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // Subscribe to online status
    this.deliveryService.isOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOnline => {
        this.isOnline = isOnline;
      });

    // Subscribe to location updates
    this.deliveryService.currentLocation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(location => {
        if (location) {
          this.currentLocation = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
          this.locationError = null;
        }
      });
  }

  private loadInitialData(): void {
    // Load orders
    this.deliveryService.refreshOrders();

    // Load stats
    this.deliveryService.refreshStats();

    // Load notifications
    this.deliveryService.refreshNotifications();

    // Load earnings
    this.loadEarnings();
  }

  toggleOnlineStatus(): void {
    const newStatus = !this.isOnline;
    this.deliveryService.setOnlineStatus(newStatus).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          this.isOnline = newStatus;
          console.log('Online status updated:', newStatus);
        }
      },
      error: (error) => {
        console.error('Failed to update online status:', error);
      }
    });
  }

  async getCurrentLocation(): Promise<void> {
    try {
      this.currentLocation = 'Getting location...';
      this.locationError = null;

      const location = await this.deliveryService.getCurrentLocation();
      this.currentLocation = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;

      // Optionally convert to address using reverse geocoding
      this.reverseGeocode(location);

    } catch (error) {
      console.error('Error getting location:', error);
      this.currentLocation = 'Location unavailable';
      this.locationError = 'Unable to get current location. Please check your GPS settings.';
    }
  }

  private reverseGeocode(location: LocationDto): void {
    // Simple reverse geocoding using browser API or external service
    // For now, just show coordinates
    this.currentLocation = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  }

  private loadEarnings(): void {
    this.deliveryService.getEarnings('daily').subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success && response.data) {
          this.earnings = response.data;
        }
      },
      error: (error) => {
        console.error('Failed to load earnings:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/delivery/profile']);
  }

  navigateToAction(route: string): void {
    this.router.navigate([route]);
  }

  refreshLocation(): void {
    this.getCurrentLocation();
  }

  callSupport(): void {
    // Open phone dialer or support chat
    window.open('tel:+1-800-SUPPORT', '_self');
  }

  emergencyAlert(): void {
    if (confirm('Are you sure you want to send an emergency alert? This will notify support immediately.')) {
      // TODO: Implement emergency alert API call
      console.log('Emergency alert sent!');
      alert('Emergency alert sent! Support will contact you shortly.');
    }
  }

  // Utility methods for template
  getOrderStatusColor(status: OrderStatus): string {
    return this.deliveryService.getOrderStatusColor(status);
  }

  getOrderStatusIcon(status: OrderStatus): string {
    return this.deliveryService.getOrderStatusIcon(status);
  }

  getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  refreshData(): void {
    this.isLoading = true;
    this.loadInitialData();
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  updateOrderStatus(orderId: number, status: string): void {
    if (!orderId) return;

    const confirmMessage = `Are you sure you want to mark order #${orderId} as ${status}?`;
    if (!confirm(confirmMessage)) return;

    let updateObservable;

    switch (status) {
      case 'PickedUp':
        updateObservable = this.deliveryService.updateOrderStatusToPending(orderId);
        break;
      case 'Delivered':
        updateObservable = this.deliveryService.updateOrderStatusToDelivered(orderId);
        break;
      default:
        console.error('Invalid status:', status);
        return;
    }

    updateObservable.subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          console.log(`Order #${orderId} status updated to ${status}`);
          // Refresh orders to get updated data
          this.deliveryService.refreshOrders();
          this.deliveryService.refreshStats();
        } else {
          alert('Failed to update order status. Please try again.');
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status. Please check your connection and try again.');
      }
    });
  }

  // Navigation Helper Methods
  private updateNavigationBadges(): void {
    // Update orders badge
    const ordersNavItem = this.navigationItems.find(item => item.route === '/delivery/orders');
    if (ordersNavItem) {
      ordersNavItem.badge = this.stats.pendingOrders > 0 ? this.stats.pendingOrders.toString() : null;
    }
  }

  shouldShowNavItem(item: any): boolean {
    return !item.requiresAuth || this.isAuthenticated;
  }

  private checkScreenSize(): void {
    // Force initial check - mobile first
    this.isDesktop = false;
    this.updateScreenSize();

    // Listen for window resize with debouncing
    let resizeTimeout: any;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateScreenSize();
      }, 100);
    });
  }

  private updateScreenSize(): void {
    const width = window.innerWidth;
    const newIsDesktop = width >= 1024;

    if (this.isDesktop !== newIsDesktop) {
      this.isDesktop = newIsDesktop;
      console.log('Delivery Layout - Screen size changed to:', this.isDesktop ? 'Desktop' : 'Mobile');

      // استخدام setTimeout لتجنب ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.cdr.markForCheck();
      }, 0);
    }
  }
}
