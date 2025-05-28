import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, switchMap, combineLatest } from 'rxjs';
import { Restaurant } from '../../../../core/models/restaurant.model';
import { MenuCategory, MenuItem, MenuFilters, SelectedCustomization } from '../../../../core/models/menu.model';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { MenuService } from '../../../../core/services/menu.service';
import { CartService } from '../../../../core/services/cart.service';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { ItemCustomizationModalComponent, CustomizationModalResult } from '../../../../shared/components/item-customization-modal/item-customization-modal.component';
import { CartSidebarComponent } from '../../../../shared/components/cart-sidebar/cart-sidebar.component';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ItemCustomizationModalComponent, CartSidebarComponent],
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.css'
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  restaurant: Restaurant | null = null;
  categories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  loading = false;

  // Filter and search
  selectedCategoryId: string | null = null;
  searchQuery = '';
  showVegetarianOnly = false;
  showVeganOnly = false;
  showGlutenFreeOnly = false;

  // UI state
  activeSection = 'menu';
  stickyCategories = false;

  // Modal and sidebar state
  showCustomizationModal = false;
  showCartSidebar = false;
  selectedMenuItem: MenuItem | null = null;

  // Cart state
  cartCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private menuService: MenuService,
    private cartService: CartService,
    private i18nService: SimpleI18nService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const restaurantId = params['id'];
        this.loading = true;

        return combineLatest([
          this.restaurantService.getRestaurantById(restaurantId),
          this.menuService.getMenuByRestaurantId(restaurantId)
        ]);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: ([restaurant, menuData]) => {
        this.restaurant = restaurant;
        this.categories = menuData.categories;
        this.menuItems = menuData.items;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading restaurant details:', error);
        this.loading = false;
      }
    });

    // Handle scroll for sticky categories
    this.handleScroll();

    // Subscribe to cart changes
    this.cartService.cartCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartCount = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCategorySelect(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();

    if (categoryId) {
      this.scrollToCategory(categoryId);
    }
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  onDietaryFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.menuItems];

    // Category filter
    if (this.selectedCategoryId) {
      filtered = filtered.filter(item => item.categoryId === this.selectedCategoryId);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Dietary filters
    if (this.showVegetarianOnly) {
      filtered = filtered.filter(item => item.isVegetarian);
    }

    if (this.showVeganOnly) {
      filtered = filtered.filter(item => item.isVegan);
    }

    if (this.showGlutenFreeOnly) {
      filtered = filtered.filter(item => item.isGlutenFree);
    }

    this.filteredItems = filtered;
  }

  private scrollToCategory(categoryId: string): void {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private handleScroll(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        this.stickyCategories = scrollTop > 300;
      });
    }
  }

  getItemsByCategory(categoryId: string): MenuItem[] {
    return this.filteredItems.filter(item => item.categoryId === categoryId);
  }

  getCategoryItemCount(categoryId: string): number {
    return this.getItemsByCategory(categoryId).length;
  }

  addToCart(item: MenuItem): void {
    // Check if restaurant can be added to cart
    if (!this.cartService.canAddToCart(item.restaurantId)) {
      const confirmSwitch = confirm(
        this.translate('cart.switchRestaurant') ||
        'Your cart contains items from another restaurant. Do you want to clear it and add items from this restaurant?'
      );

      if (!confirmSwitch) {
        return;
      }

      this.cartService.clearCart();
    }

    // If item has customizations, show modal
    if (item.customizations && item.customizations.length > 0) {
      this.selectedMenuItem = item;
      this.showCustomizationModal = true;
    } else {
      // Add directly to cart
      this.cartService.addItem(item, 1, []);
      this.showCartSidebar = true;
    }
  }

  onCustomizationConfirm(result: CustomizationModalResult): void {
    if (this.selectedMenuItem) {
      this.cartService.addItem(
        this.selectedMenuItem,
        result.quantity,
        result.customizations,
        result.specialInstructions
      );
      this.showCartSidebar = true;
    }
    this.closeCustomizationModal();
  }

  onCustomizationCancel(): void {
    this.closeCustomizationModal();
  }

  private closeCustomizationModal(): void {
    this.showCustomizationModal = false;
    this.selectedMenuItem = null;
  }

  onCartSidebarClose(): void {
    this.showCartSidebar = false;
  }

  onCheckout(): void {
    this.showCartSidebar = false;
    this.router.navigate(['/customer/checkout']);
  }

  toggleCartSidebar(): void {
    this.showCartSidebar = !this.showCartSidebar;
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getOperatingStatus(): { isOpen: boolean; message: string } {
    if (!this.restaurant) {
      return { isOpen: false, message: 'Unknown' };
    }

    // Simple implementation - in real app, would check actual time
    return {
      isOpen: this.restaurant.isOpen,
      message: this.restaurant.isOpen ? 'Open Now' : 'Closed'
    };
  }

  getDietaryIcons(item: MenuItem): string[] {
    const icons: string[] = [];
    if (item.isVegetarian) icons.push('🥬');
    if (item.isVegan) icons.push('🌱');
    if (item.isGlutenFree) icons.push('🌾');
    if (item.isSpicy) icons.push('🌶️');
    return icons;
  }

  trackByCategory(index: number, category: MenuCategory): string {
    return category.id;
  }

  trackByItem(index: number, item: MenuItem): string {
    return item.id;
  }
}
