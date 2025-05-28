import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, SelectedCustomization } from '../models/menu.model';
import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'restaurant-app-cart';
  
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  private cartTotalSubject = new BehaviorSubject<number>(0);
  private cartCountSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromStorage();
  }

  // Observables
  get cart$(): Observable<Cart | null> {
    return this.cartSubject.asObservable();
  }

  get cartItems$(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  get cartTotal$(): Observable<number> {
    return this.cartTotalSubject.asObservable();
  }

  get cartCount$(): Observable<number> {
    return this.cartCountSubject.asObservable();
  }

  // Getters
  get currentCart(): Cart | null {
    return this.cartSubject.value;
  }

  get cartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  get cartTotal(): number {
    return this.cartTotalSubject.value;
  }

  get cartCount(): number {
    return this.cartCountSubject.value;
  }

  // Cart Operations
  addItem(
    menuItem: MenuItem, 
    quantity: number = 1, 
    customizations: SelectedCustomization[] = [],
    specialInstructions?: string
  ): void {
    const currentCart = this.currentCart;
    
    // If cart is empty or from different restaurant, create new cart
    if (!currentCart || currentCart.restaurantId !== menuItem.restaurantId) {
      this.createNewCart(menuItem.restaurantId);
    }

    const cartItem: CartItem = {
      id: this.generateCartItemId(),
      menuItem,
      quantity,
      customizations,
      specialInstructions,
      totalPrice: this.calculateItemPrice(menuItem, quantity, customizations)
    };

    // Check if identical item already exists
    const existingItemIndex = this.findExistingItemIndex(cartItem);
    
    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const items = [...this.cartItems];
      items[existingItemIndex].quantity += quantity;
      items[existingItemIndex].totalPrice = this.calculateItemPrice(
        items[existingItemIndex].menuItem,
        items[existingItemIndex].quantity,
        items[existingItemIndex].customizations
      );
      this.updateCartItems(items);
    } else {
      // Add new item
      const items = [...this.cartItems, cartItem];
      this.updateCartItems(items);
    }

    this.saveCartToStorage();
  }

  removeItem(cartItemId: string): void {
    const items = this.cartItems.filter(item => item.id !== cartItemId);
    this.updateCartItems(items);
    this.saveCartToStorage();
  }

  updateItemQuantity(cartItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    const items = this.cartItems.map(item => {
      if (item.id === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: this.calculateItemPrice(item.menuItem, quantity, item.customizations)
        };
      }
      return item;
    });

    this.updateCartItems(items);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartSubject.next(null);
    this.cartItemsSubject.next([]);
    this.updateTotals();
    this.removeCartFromStorage();
  }

  // Private Methods
  private createNewCart(restaurantId: string): void {
    const newCart: Cart = {
      id: this.generateCartId(),
      userId: 'guest', // Will be updated when user logs in
      restaurantId,
      items: [],
      subtotal: 0,
      tax: 0,
      deliveryFee: 0,
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cartSubject.next(newCart);
    this.cartItemsSubject.next([]);
  }

  private updateCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    
    const currentCart = this.currentCart;
    if (currentCart) {
      currentCart.items = items;
      currentCart.updatedAt = new Date();
      this.cartSubject.next(currentCart);
    }

    this.updateTotals();
  }

  private updateTotals(): void {
    const items = this.cartItems;
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = subtotal > 25 ? 0 : 2.99; // Free delivery over $25
    const total = subtotal + tax + deliveryFee;

    const currentCart = this.currentCart;
    if (currentCart) {
      currentCart.subtotal = subtotal;
      currentCart.tax = tax;
      currentCart.deliveryFee = deliveryFee;
      currentCart.total = total;
      this.cartSubject.next(currentCart);
    }

    this.cartTotalSubject.next(total);
    this.cartCountSubject.next(items.reduce((sum, item) => sum + item.quantity, 0));
  }

  private calculateItemPrice(
    menuItem: MenuItem, 
    quantity: number, 
    customizations: SelectedCustomization[]
  ): number {
    let basePrice = menuItem.price;
    
    // Add customization prices
    customizations.forEach(customization => {
      const menuCustomization = menuItem.customizations.find(c => c.id === customization.customizationId);
      if (menuCustomization) {
        customization.optionIds.forEach(optionId => {
          const option = menuCustomization.options.find(o => o.id === optionId);
          if (option) {
            basePrice += option.price;
          }
        });
      }
    });

    return basePrice * quantity;
  }

  private findExistingItemIndex(newItem: CartItem): number {
    return this.cartItems.findIndex(item => 
      item.menuItem.id === newItem.menuItem.id &&
      this.areCustomizationsEqual(item.customizations, newItem.customizations) &&
      item.specialInstructions === newItem.specialInstructions
    );
  }

  private areCustomizationsEqual(
    customizations1: SelectedCustomization[], 
    customizations2: SelectedCustomization[]
  ): boolean {
    if (customizations1.length !== customizations2.length) return false;
    
    return customizations1.every(c1 => {
      const c2 = customizations2.find(c => c.customizationId === c1.customizationId);
      if (!c2) return false;
      
      return c1.optionIds.length === c2.optionIds.length &&
             c1.optionIds.every(id => c2.optionIds.includes(id)) &&
             c1.textValue === c2.textValue;
    });
  }

  private generateCartId(): string {
    return 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private generateCartItemId(): string {
    return 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Storage Methods
  private saveCartToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const cartData = {
        cart: this.currentCart,
        items: this.cartItems
      };
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartData));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        try {
          const cartData = JSON.parse(stored);
          if (cartData.cart && cartData.items) {
            this.cartSubject.next(cartData.cart);
            this.cartItemsSubject.next(cartData.items);
            this.updateTotals();
          }
        } catch (error) {
          console.error('Error loading cart from storage:', error);
          this.removeCartFromStorage();
        }
      }
    }
  }

  private removeCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.CART_STORAGE_KEY);
    }
  }

  // Utility Methods
  isRestaurantInCart(restaurantId: string): boolean {
    return this.currentCart?.restaurantId === restaurantId;
  }

  getItemQuantityInCart(menuItemId: string): number {
    return this.cartItems
      .filter(item => item.menuItem.id === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  canAddToCart(restaurantId: string): boolean {
    const currentCart = this.currentCart;
    return !currentCart || currentCart.restaurantId === restaurantId;
  }
}
