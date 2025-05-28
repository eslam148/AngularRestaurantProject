import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LayoutService, LayoutType } from '../../services/layout.service';
import { NavigationBarComponent } from '../../shared/components/navigation-bar/navigation-bar.component';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  children?: MenuItem[];
  badge?: string;
  badgeColor?: string;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationBarComponent]
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  // Layout State
  LayoutType = LayoutType;
  currentLayout: LayoutType = LayoutType.ADMIN;

  isAuthenticated = false;
  currentUser: any = null;
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isDesktop = false;

  // Navigation Items for Admin Layout
  navigationItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: '📊', badge: null as string | null },
    { label: 'Restaurants', route: '/admin/restaurants', icon: '🏪', badge: null as string | null },
    { label: 'Orders', route: '/admin/orders', icon: '📦', badge: null as string | null },
    { label: 'Analytics', route: '/admin/analytics', icon: '📈', badge: null as string | null },
    { label: 'Settings', route: '/admin/settings', icon: '⚙️', badge: null as string | null }
  ];

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      icon: '📊'
    },
    {
      label: 'Restaurants',
      route: '/admin/restaurants',
      icon: '🏪',
      children: [
        { label: 'All Restaurants', route: '/admin/restaurants', icon: '📋' },
        { label: 'Add Restaurant', route: '/admin/restaurants/add', icon: '➕' },
        { label: 'Categories', route: '/admin/restaurants/categories', icon: '🏷️' }
      ]
    },
    {
      label: 'Menu Management',
      route: '/admin/menu',
      icon: '🍽️',
      children: [
        { label: 'Menu Items', route: '/admin/menu/items', icon: '🍕' },
        { label: 'Add Item', route: '/admin/menu/add', icon: '➕' },
        { label: 'Categories', route: '/admin/menu/categories', icon: '📂' }
      ]
    },
    {
      label: 'Orders',
      route: '/admin/orders',
      icon: '📦',
      badge: '12',
      badgeColor: 'warning',
      children: [
        { label: 'All Orders', route: '/admin/orders', icon: '📋' },
        { label: 'Pending', route: '/admin/orders/pending', icon: '⏳', badge: '5', badgeColor: 'warning' },
        { label: 'In Progress', route: '/admin/orders/progress', icon: '🔄', badge: '3', badgeColor: 'info' },
        { label: 'Completed', route: '/admin/orders/completed', icon: '✅' },
        { label: 'Cancelled', route: '/admin/orders/cancelled', icon: '❌' }
      ]
    },
    {
      label: 'Customers',
      route: '/admin/customers',
      icon: '👥',
      children: [
        { label: 'All Customers', route: '/admin/customers', icon: '👥' },
        { label: 'Customer Reviews', route: '/admin/customers/reviews', icon: '⭐' },
        { label: 'Support Tickets', route: '/admin/customers/support', icon: '🎫' }
      ]
    },
    {
      label: 'Delivery',
      route: '/admin/delivery',
      icon: '🚚',
      children: [
        { label: 'Delivery Personnel', route: '/admin/delivery/personnel', icon: '🏃' },
        { label: 'Delivery Zones', route: '/admin/delivery/zones', icon: '🗺️' },
        { label: 'Tracking', route: '/admin/delivery/tracking', icon: '📍' }
      ]
    },
    {
      label: 'Analytics',
      route: '/admin/analytics',
      icon: '📈',
      children: [
        { label: 'Sales Report', route: '/admin/analytics/sales', icon: '💰' },
        { label: 'Customer Analytics', route: '/admin/analytics/customers', icon: '👥' },
        { label: 'Performance', route: '/admin/analytics/performance', icon: '⚡' }
      ]
    },
    {
      label: 'Settings',
      route: '/admin/settings',
      icon: '⚙️',
      children: [
        { label: 'General Settings', route: '/admin/settings/general', icon: '🔧' },
        { label: 'Payment Settings', route: '/admin/settings/payment', icon: '💳' },
        { label: 'Notification Settings', route: '/admin/settings/notifications', icon: '🔔' },
        { label: 'User Management', route: '/admin/settings/users', icon: '👤' }
      ]
    }
  ];

  expandedMenus: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.currentUser = this.authService.getCurrentUser();
        } else {
          this.currentUser = null;
          this.router.navigate(['/login']);
        }
      });
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

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  toggleMenu(menuLabel: string): void {
    if (this.expandedMenus.has(menuLabel)) {
      this.expandedMenus.delete(menuLabel);
    } else {
      this.expandedMenus.add(menuLabel);
    }
  }

  isMenuExpanded(menuLabel: string): boolean {
    return this.expandedMenus.has(menuLabel);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  hasChildren(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  // Navigation Helper Methods
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
      console.log('Admin Layout - Screen size changed to:', this.isDesktop ? 'Desktop' : 'Mobile');

      // استخدام setTimeout لتجنب ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.cdr.markForCheck();
      }, 0);
    }
  }

  // Layout Switcher Methods
  switchToCustomerLayout(): void {
    this.layoutService.setCustomerLayout();
  }

  switchToDeliveryLayout(): void {
    this.layoutService.setDeliveryLayout();
  }
}
