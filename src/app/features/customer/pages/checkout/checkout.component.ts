import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Cart, CartItem } from '../../../../core/models/menu.model';
import { Order, PaymentMethod, PaymentMethodType } from '../../../../core/models/order.model';
import { Address } from '../../../../core/models/user.model';
import { CartService } from '../../../../core/services/cart.service';
import { CheckoutService, CheckoutData, CheckoutStep } from '../../../../core/services/checkout.service';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  cart: Cart | null = null;
  cartItems: CartItem[] = [];
  checkoutData: CheckoutData | null = null;
  currentStep = 0;
  steps: CheckoutStep[] = [];
  loading = false;
  placingOrder = false;

  // Address step
  availableAddresses: Address[] = [];
  selectedAddressId: string | null = null;
  customAddress = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  };
  deliveryInstructions = '';
  useCustomAddress = false;

  // Payment step
  selectedPaymentMethod: PaymentMethodType | null = null;
  paymentMethods = [
    { id: PaymentMethodType.CASH, name: 'Cash on Delivery', icon: 'bi-cash-coin', description: 'Pay with cash when your order arrives' },
    { id: PaymentMethodType.CREDIT_CARD, name: 'Credit Card', icon: 'bi-credit-card', description: 'Pay securely with your credit card' },
    { id: PaymentMethodType.DEBIT_CARD, name: 'Debit Card', icon: 'bi-credit-card-2-front', description: 'Pay with your debit card' },
    { id: PaymentMethodType.DIGITAL_WALLET, name: 'Digital Wallet', icon: 'bi-wallet2', description: 'Apple Pay, Google Pay, etc.' }
  ];

  // Expose enums to template
  PaymentMethodType = PaymentMethodType;

  constructor(
    private router: Router,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private i18nService: SimpleI18nService
  ) {}

  ngOnInit(): void {
    // Check if cart is empty
    if (this.cartService.cartItems.length === 0) {
      this.router.navigate(['/customer/restaurants']);
      return;
    }

    this.loadCartData();
    this.loadCheckoutData();
    this.loadMockAddresses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCartData(): void {
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
  }

  private loadCheckoutData(): void {
    this.checkoutService.checkoutData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.checkoutData = data;
        this.deliveryInstructions = data.deliveryInstructions;
      });

    this.checkoutService.currentStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => {
        this.currentStep = step;
      });

    this.checkoutService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.placingOrder = loading;
      });

    this.steps = this.checkoutService.getSteps();
  }

  private loadMockAddresses(): void {
    this.availableAddresses = this.checkoutService.getMockAddresses();
    // Select default address if available
    const defaultAddress = this.availableAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      this.selectedAddressId = defaultAddress.id;
    }
  }

  // Step Navigation
  goToStep(stepIndex: number): void {
    this.checkoutService.goToStep(stepIndex);
  }

  nextStep(): void {
    if (this.canProceedToNextStep()) {
      this.processCurrentStep();
      this.checkoutService.nextStep();
    }
  }

  previousStep(): void {
    this.checkoutService.previousStep();
  }

  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 0: // Address step
        return this.useCustomAddress ? this.isCustomAddressValid() : this.selectedAddressId !== null;
      case 1: // Payment step
        return this.selectedPaymentMethod !== null;
      case 2: // Review step
        return this.checkoutService.canProceedToNextStep();
      default:
        return false;
    }
  }

  private processCurrentStep(): void {
    switch (this.currentStep) {
      case 0: // Address step
        this.saveAddressData();
        break;
      case 1: // Payment step
        this.savePaymentData();
        break;
    }
  }

  // Address Step Methods
  onAddressSelectionChange(): void {
    this.useCustomAddress = false;
  }

  onUseCustomAddressChange(): void {
    if (this.useCustomAddress) {
      this.selectedAddressId = null;
    }
  }

  private isCustomAddressValid(): boolean {
    return !!(
      this.customAddress.street &&
      this.customAddress.city &&
      this.customAddress.state &&
      this.customAddress.zipCode
    );
  }

  private saveAddressData(): void {
    let deliveryAddress;

    if (this.useCustomAddress) {
      deliveryAddress = {
        street: this.customAddress.street,
        city: this.customAddress.city,
        state: this.customAddress.state,
        zipCode: this.customAddress.zipCode,
        country: this.customAddress.country,
        coordinates: { latitude: 0, longitude: 0 }, // Would geocode in real app
        deliveryInstructions: this.deliveryInstructions
      };
    } else {
      const selectedAddress = this.availableAddresses.find(addr => addr.id === this.selectedAddressId);
      if (selectedAddress) {
        deliveryAddress = this.checkoutService.convertAddressToDeliveryAddress(
          selectedAddress,
          this.deliveryInstructions
        );
      }
    }

    if (deliveryAddress) {
      this.checkoutService.setDeliveryAddress(deliveryAddress);
      this.checkoutService.setDeliveryInstructions(this.deliveryInstructions);
    }
  }

  // Payment Step Methods
  selectPaymentMethod(method: PaymentMethodType): void {
    this.selectedPaymentMethod = method;
  }

  private savePaymentData(): void {
    if (this.selectedPaymentMethod) {
      const paymentMethod: PaymentMethod = {
        id: this.selectedPaymentMethod,
        name: this.paymentMethods.find(pm => pm.id === this.selectedPaymentMethod)?.name || ''
      };
      this.checkoutService.setPaymentMethod(paymentMethod);
    }
  }

  // Order Placement
  placeOrder(): void {
    if (!this.cart) return;

    this.checkoutService.placeOrder(this.cart)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order: Order) => {
          // Clear cart after successful order
          this.cartService.clearCart();
          // Navigate to order confirmation
          this.router.navigate(['/customer/order', order.id]);
        },
        error: (error) => {
          console.error('Error placing order:', error);
          // Handle error (show toast, etc.)
        }
      });
  }

  // Utility Methods
  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  getSelectedAddress(): Address | null {
    return this.availableAddresses.find(addr => addr.id === this.selectedAddressId) || null;
  }

  getSelectedPaymentMethodInfo() {
    return this.paymentMethods.find(method => method.id === this.selectedPaymentMethod);
  }

  getEstimatedDeliveryTime(): string {
    if (this.checkoutData?.estimatedDeliveryTime) {
      return this.checkoutData.estimatedDeliveryTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return '';
  }

  trackByCartItem(index: number, item: CartItem): string {
    return item.id;
  }

  getCustomizationSummary(cartItem: CartItem): string {
    if (!cartItem.customizations || cartItem.customizations.length === 0) {
      return '';
    }

    const summaries: string[] = [];
    cartItem.customizations.forEach(customization => {
      // In a real app, you'd resolve customization IDs to names
      summaries.push(`Customization: ${customization.optionIds.join(', ')}`);
    });

    return summaries.join(' • ');
  }
}
