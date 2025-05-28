import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService, LayoutType } from '../../../services/layout.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() currentLayout: LayoutType = LayoutType.CUSTOMER;
  @Input() showLayoutSwitcher: boolean = true;
  @Input() navigationItems: any[] = [];
  @Input() isAuthenticated: boolean = false;
  @Input() currentUser: any = null;

  LayoutType = LayoutType;
  isMobileMenuOpen = false;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.layoutService.currentLayout$
      .pipe(takeUntil(this.destroy$))
      .subscribe(layout => {
        this.currentLayout = layout;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Layout Switcher Methods
  switchToCustomerLayout(): void {
    this.layoutService.setCustomerLayout();
    this.closeMobileMenu();
  }

  switchToAdminLayout(): void {
    this.layoutService.setAdminLayout();
    this.closeMobileMenu();
  }

  switchToDeliveryLayout(): void {
    this.layoutService.setDeliveryLayout();
    this.closeMobileMenu();
  }

  // Mobile Menu Methods
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Navigation Methods
  shouldShowNavItem(item: any): boolean {
    return !item.requiresAuth || this.isAuthenticated;
  }

  // Authentication Methods
  login(): void {
    // Implement login logic
    this.closeMobileMenu();
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  register(): void {
    // Implement register logic
    this.closeMobileMenu();
  }

  goToProfile(): void {
    // Implement profile navigation
    this.closeMobileMenu();
  }

  // Utility Methods
  getLayoutDisplayName(layout: LayoutType): string {
    switch (layout) {
      case LayoutType.CUSTOMER:
        return 'Customer';
      case LayoutType.ADMIN:
        return 'Admin';
      case LayoutType.DELIVERY:
        return 'Delivery';
      default:
        return 'Unknown';
    }
  }

  getLayoutIcon(layout: LayoutType): string {
    switch (layout) {
      case LayoutType.CUSTOMER:
        return '🍽️';
      case LayoutType.ADMIN:
        return '⚙️';
      case LayoutType.DELIVERY:
        return '🚚';
      default:
        return '❓';
    }
  }

  getLayoutColor(layout: LayoutType): string {
    switch (layout) {
      case LayoutType.CUSTOMER:
        return 'customer';
      case LayoutType.ADMIN:
        return 'admin';
      case LayoutType.DELIVERY:
        return 'delivery';
      default:
        return 'default';
    }
  }
}
