import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Cart, CartItem } from '../../../core/models/menu.model';
import { CartService } from '../../../core/services/cart.service';
import { SimpleI18nService } from '../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.component.html',
  styleUrl: './cart-sidebar.component.css'
})
export class CartSidebarComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCheckout = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  cart: Cart | null = null;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  cartCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private i18nService: SimpleI18nService
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
      });

    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
      });

    this.cartService.cartTotal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => {
        this.cartTotal = total;
      });

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

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose.emit();
    }
  }

  onCloseClick(): void {
    this.onClose.emit();
  }

  onQuantityIncrease(cartItem: CartItem): void {
    this.cartService.updateItemQuantity(cartItem.id, cartItem.quantity + 1);
  }

  onQuantityDecrease(cartItem: CartItem): void {
    if (cartItem.quantity > 1) {
      this.cartService.updateItemQuantity(cartItem.id, cartItem.quantity - 1);
    } else {
      this.onRemoveItem(cartItem);
    }
  }

  onRemoveItem(cartItem: CartItem): void {
    this.cartService.removeItem(cartItem.id);
  }

  onClearCart(): void {
    if (confirm(this.translate('cart.clearConfirm') || 'Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  onCheckoutClick(): void {
    this.onClose.emit();
    this.router.navigate(['/customer/checkout']);
  }

  getCustomizationSummary(cartItem: CartItem): string {
    if (!cartItem.customizations || cartItem.customizations.length === 0) {
      return '';
    }

    const summaries: string[] = [];

    cartItem.customizations.forEach(customization => {
      const menuCustomization = cartItem.menuItem.customizations.find(c => c.id === customization.customizationId);
      if (menuCustomization) {
        const selectedOptions = customization.optionIds
          .map(optionId => {
            const option = menuCustomization.options.find(o => o.id === optionId);
            return option ? option.name : '';
          })
          .filter(name => name)
          .join(', ');

        if (selectedOptions) {
          summaries.push(`${menuCustomization.name}: ${selectedOptions}`);
        }

        if (customization.textValue) {
          summaries.push(`${menuCustomization.name}: ${customization.textValue}`);
        }
      }
    });

    return summaries.join(' • ');
  }

  isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  canCheckout(): boolean {
    return !this.isEmpty() && this.cart !== null;
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

  trackByCartItem(index: number, item: CartItem): string {
    return item.id;
  }

  getDietaryIcons(cartItem: CartItem): string[] {
    const icons: string[] = [];
    if (cartItem.menuItem.isVegetarian) icons.push('🥬');
    if (cartItem.menuItem.isVegan) icons.push('🌱');
    if (cartItem.menuItem.isGlutenFree) icons.push('🌾');
    if (cartItem.menuItem.isSpicy) icons.push('🌶️');
    return icons;
  }

  getItemSubtotal(cartItem: CartItem): number {
    return cartItem.totalPrice;
  }

  getDeliveryFeeText(): string {
    if (!this.cart) return '';

    if (this.cart.deliveryFee === 0) {
      return this.translate('cart.freeDelivery') || 'Free Delivery';
    }

    return `$${this.formatPrice(this.cart.deliveryFee)}`;
  }

  getMinimumOrderMessage(): string {
    // This would typically come from the restaurant data
    const minimumOrder = 15; // Example minimum order

    if (this.cart && this.cart.subtotal < minimumOrder) {
      const remaining = minimumOrder - this.cart.subtotal;
      return this.translate('cart.minimumOrder') || `Add $${this.formatPrice(remaining)} more for minimum order`;
    }

    return '';
  }
}
