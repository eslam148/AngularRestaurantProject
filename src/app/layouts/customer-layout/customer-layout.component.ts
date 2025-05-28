import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { MenuService } from '../../services/menu.service';
import { RestaurantService } from '../../services/restaurant.service';
import { LayoutService, LayoutType } from '../../services/layout.service';
import { CartItemDTO, MenuItemDTO } from '../../models/menu-dto';
import { RestaurantDTO } from '../../models/restaurant-dto';
import { ResponseStatus } from '../../models/response';
import { NavigationBarComponent } from '../../shared/components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavigationBarComponent]
})
export class CustomerLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  // Layout State
  LayoutType = LayoutType;
  currentLayout: LayoutType = LayoutType.CUSTOMER;

  // Authentication & User State
  isAuthenticated = false;
  currentUser: any = null;

  // UI State
  isMobileMenuOpen = false;
  isCartOpen = false;
  isLoading = false;
  isInitialLoad = true;
  searchQuery = '';
  isDesktop = false;

  // Cart State
  cartItems: CartItemDTO[] = [];
  cartItemCount = 0;
  cartTotal = 0;

  // Data State
  featuredRestaurants: RestaurantDTO[] = [];
  searchResults: MenuItemDTO[] = [];
  recentOrders: any[] = [];

  // Navigation
  navigationItems = [
    { label: 'Home', route: '/restaurants', icon: '🏠', badge: null as string | null },
    { label: 'Restaurants', route: '/restaurants', icon: '🍽️', badge: null as string | null },
    { label: 'Orders', route: '/orders', icon: '📋', requiresAuth: true, badge: null as string | null },
    { label: 'Favorites', route: '/favorites', icon: '❤️', requiresAuth: true, badge: null as string | null },
    { label: 'Profile', route: '/profile', icon: '👤', requiresAuth: true, badge: null as string | null }
  ];

  // Quick Actions
  quickActions = [
    { label: 'Order Again', icon: '🔄', action: 'reorder', requiresAuth: true },
    { label: 'Track Order', icon: '📍', action: 'track', requiresAuth: true },
    { label: 'Browse Menu', icon: '📖', action: 'browse', requiresAuth: false },
    { label: 'Special Offers', icon: '🎉', action: 'offers', requiresAuth: false }
  ];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private menuService: MenuService,
    private restaurantService: RestaurantService,
    private layoutService: LayoutService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.setupSubscriptions();
    this.loadInitialData();
  }

  ngAfterViewInit(): void {
    // تأخير فحص حجم الشاشة حتى بعد تهيئة العرض
    setTimeout(() => {
      this.checkScreenSize();
    }, 0);
  }

  private initializeComponent(): void {
    // Set initial loading state
    this.isLoading = true;
    console.log('Customer Layout - Initialize: isLoading set to true');
  }

  private setupSubscriptions(): void {
    // Authentication state subscription
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
        if (isAuth) {
          this.currentUser = this.authService.getCurrentUser();
          this.loadUserSpecificData();
        } else {
          this.currentUser = null;
          this.clearUserData();
        }
      });

    // Cart state subscriptions
    combineLatest([
      this.orderService.cart$,
      this.orderService.cartTotal$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([cartItems, cartTotal]) => {
        this.cartItems = cartItems;
        this.cartItemCount = this.orderService.getCartItemCount();
        this.cartTotal = cartTotal;
        this.updateNavigationBadges();
      });

    // Loading state subscription
    this.orderService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        console.log('Customer Layout - OrderService loading state changed:', loading);
        // Only update loading if we're not in initial load phase
        if (!this.isInitialLoad) {
          this.isLoading = loading;
        }
      });
  }

  private loadInitialData(): void {
    console.log('Customer Layout - Loading initial data...');

    let loadingTasks = 1; // At least one task (featured restaurants)
    let completedTasks = 0;
    let isLoadingCompleted = false;

    const finishLoading = () => {
      if (!isLoadingCompleted) {
        isLoadingCompleted = true;
        this.isInitialLoad = false;
        this.isLoading = false;
        console.log('Customer Layout - Loading completed');
      }
    };

    const checkLoadingComplete = () => {
      completedTasks++;
      console.log(`Customer Layout - Task completed: ${completedTasks}/${loadingTasks}`);

      if (completedTasks >= loadingTasks) {
        finishLoading();
      }
    };

    // Fallback timeout to ensure loading doesn't hang
    setTimeout(() => {
      if (!isLoadingCompleted) {
        console.log('Customer Layout - Loading timeout reached, forcing completion');
        finishLoading();
      }
    }, 5000); // 5 seconds max

    // Load featured restaurants
    this.loadFeaturedRestaurants().then(() => {
      checkLoadingComplete();
    }).catch(() => {
      checkLoadingComplete();
    });

    // Load user-specific data if authenticated
    if (this.isAuthenticated) {
      loadingTasks++;
      this.loadUserSpecificData().then(() => {
        checkLoadingComplete();
      }).catch(() => {
        checkLoadingComplete();
      });
    }
  }

  private loadFeaturedRestaurants(): Promise<void> {
    return new Promise((resolve) => {
      this.restaurantService.getAllRestaurants().subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.featuredRestaurants = response.data.slice(0, 6); // Show top 6
          }
          resolve();
        },
        error: (error) => {
          console.error('Error loading featured restaurants:', error);
          resolve(); // Resolve even on error to not block loading
        }
      });
    });
  }

  private loadUserSpecificData(): Promise<void> {
    return new Promise((resolve) => {
      // Load recent orders
      this.orderService.getAllOrders().subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success) {
            this.recentOrders = response.data.slice(0, 3); // Show last 3 orders
          }
          resolve();
        },
        error: (error) => {
          console.error('Error loading recent orders:', error);
          resolve(); // Resolve even on error to not block loading
        }
      });
    });
  }

  private clearUserData(): void {
    this.recentOrders = [];
    this.orderService.clearCart();
  }

  private updateNavigationBadges(): void {
    // Update cart badge
    const cartNavItem = this.navigationItems.find(item => item.route === '/cart');
    if (cartNavItem) {
      cartNavItem.badge = this.cartItemCount > 0 ? this.cartItemCount.toString() : null;
    }

    // Update orders badge if there are pending orders
    const ordersNavItem = this.navigationItems.find(item => item.route === '/orders');
    if (ordersNavItem && this.recentOrders.length > 0) {
      const pendingOrders = this.recentOrders.filter(order =>
        order.orderStatus === 'Pending' || order.orderStatus === 'InProgress'
      ).length;
      ordersNavItem.badge = pendingOrders > 0 ? pendingOrders.toString() : null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // UI Interaction Methods
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Enhanced Search Functionality
  searchSuggestions: any[] = [];
  showSuggestions = false;
  selectedSuggestionIndex = -1;
  private searchTimeout: any;

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.performSearch(this.searchQuery.trim());
    }
  }

  onSearchInput(): void {
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Debounce search suggestions
    this.searchTimeout = setTimeout(() => {
      if (this.searchQuery.trim().length >= 2) {
        this.loadSearchSuggestions(this.searchQuery.trim());
      } else {
        this.hideSuggestions();
      }
    }, 300);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.searchSuggestions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.searchSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.searchSuggestions[this.selectedSuggestionIndex]);
        } else {
          this.onSearch();
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  loadSearchSuggestions(query: string): void {
    this.menuService.searchMenuItems(query).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          this.searchSuggestions = response.data.slice(0, 5).map(item => ({
            text: item.name,
            type: 'dish',
            icon: '🍽️',
            data: item
          }));

          // Add restaurant suggestions if available
          this.restaurantService.getAllRestaurants().subscribe({
            next: (restaurantResponse) => {
              if (restaurantResponse.status === ResponseStatus.Success) {
                const restaurantSuggestions = restaurantResponse.data
                  .filter(restaurant =>
                    restaurant.name.toLowerCase().includes(query.toLowerCase())
                  )
                  .slice(0, 3)
                  .map(restaurant => ({
                    text: restaurant.name,
                    type: 'restaurant',
                    icon: '🏪',
                    data: restaurant
                  }));

                this.searchSuggestions = [...this.searchSuggestions, ...restaurantSuggestions];
                this.showSuggestions = this.searchSuggestions.length > 0;
              }
            }
          });
        }
      },
      error: (error) => {
        console.error('Search suggestions failed:', error);
        this.hideSuggestions();
      }
    });
  }

  selectSuggestion(suggestion: any): void {
    this.searchQuery = suggestion.text;
    this.hideSuggestions();

    if (suggestion.type === 'restaurant') {
      this.goToRestaurant(suggestion.data.id);
    } else {
      this.performSearch(suggestion.text);
    }
  }

  hideSuggestions(): void {
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
    this.searchSuggestions = [];
  }

  performSearch(query: string): void {
    this.isLoading = true;
    this.hideSuggestions();

    this.menuService.searchMenuItems(query).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          this.searchResults = response.data;
          this.router.navigate(['/search'], {
            queryParams: { q: query }
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Search failed:', error);
        this.isLoading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.hideSuggestions();
  }

  // Authentication Methods
  login(): void {
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

  register(): void {
    this.closeMobileMenu();
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.closeCart();
    this.router.navigate(['/restaurants']);
  }

  // Navigation Methods
  navigateTo(route: string): void {
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  goToCart(): void {
    if (this.cartItemCount > 0) {
      this.router.navigate(['/cart']);
    } else {
      this.toggleCart();
    }
  }

  goToProfile(): void {
    this.closeMobileMenu();
    this.router.navigate(['/profile']);
  }

  goToRestaurant(restaurantId: number): void {
    this.router.navigate(['/restaurant', restaurantId]);
  }

  // Cart Management Methods
  addToCart(menuItem: MenuItemDTO, quantity: number = 1): void {
    const cartItem: CartItemDTO = {
      menuItemId: menuItem.id,
      menuItem: menuItem,
      quantity: quantity,
      specialInstructions: '',
      totalPrice: menuItem.price * quantity
    };

    this.orderService.addToCart(cartItem);
  }

  removeFromCart(menuItemId: number): void {
    this.orderService.removeFromCart(menuItemId);
  }

  updateCartQuantity(menuItemId: number, quantity: number): void {
    this.orderService.updateCartItemQuantity(menuItemId, quantity);
  }

  clearCart(): void {
    this.orderService.clearCart();
  }

  // Quick Actions
  handleQuickAction(action: string): void {
    switch (action) {
      case 'reorder':
        this.reorderLastOrder();
        break;
      case 'track':
        this.trackActiveOrder();
        break;
      case 'browse':
        this.router.navigate(['/restaurants']);
        break;
      case 'offers':
        this.router.navigate(['/offers']);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  private reorderLastOrder(): void {
    if (this.recentOrders.length > 0) {
      const lastOrder = this.recentOrders[0];
      // TODO: Implement reorder functionality
      console.log('Reordering:', lastOrder);
    }
  }

  private trackActiveOrder(): void {
    const activeOrder = this.recentOrders.find(order =>
      order.orderStatus === 'Pending' || order.orderStatus === 'InProgress'
    );

    if (activeOrder) {
      this.router.navigate(['/track-order', activeOrder.id]);
    } else {
      this.router.navigate(['/orders']);
    }
  }

  // Utility Methods
  shouldShowNavItem(item: any): boolean {
    return !item.requiresAuth || this.isAuthenticated;
  }

  shouldShowQuickAction(action: any): boolean {
    return !action.requiresAuth || this.isAuthenticated;
  }

  getCartItemsCount(): number {
    return this.cartItemCount;
  }

  getCartTotal(): number {
    return this.cartTotal;
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  // Data Refresh Methods
  refreshData(): void {
    this.loadInitialData();
  }

  refreshCart(): void {
    // Cart is automatically updated through observables
  }

  refreshOrders(): void {
    if (this.isAuthenticated) {
      this.loadUserSpecificData();
    }
  }

  // TrackBy function for cart items
  trackCartItem(_index: number, item: CartItemDTO): number {
    return item.menuItemId;
  }

  // Delayed hide suggestions for blur event
  delayedHideSuggestions(): void {
    setTimeout(() => this.hideSuggestions(), 200);
  }

  private checkScreenSize(): void {
    // Force initial check
    this.isDesktop = false; // Start with mobile-first
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

    console.log('Customer Layout - Screen check:', {
      width: width,
      oldIsDesktop: this.isDesktop,
      newIsDesktop: newIsDesktop
    });

    if (this.isDesktop !== newIsDesktop) {
      this.isDesktop = newIsDesktop;
      console.log('Customer Layout - Screen size changed to:', this.isDesktop ? 'Desktop' : 'Mobile');

      // استخدام setTimeout لتجنب ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.cdr.markForCheck();
      }, 0);
    }
  }

  // Layout Switcher Methods
  switchToAdminLayout(): void {
    this.layoutService.setAdminLayout();
  }

  switchToDeliveryLayout(): void {
    this.layoutService.setDeliveryLayout();
  }
}
