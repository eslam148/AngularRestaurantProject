import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, switchMap } from 'rxjs';
import { Order, OrderStatus, PaymentMethod, PaymentMethodType, DeliveryAddress } from '../models/order.model';
import { Cart } from '../models/menu.model';
import { Address } from '../models/user.model';
import { OrderService } from './order.service';

export interface CheckoutStep {
  id: string;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CheckoutData {
  deliveryAddress: DeliveryAddress | null;
  paymentMethod: PaymentMethod | null;
  deliveryInstructions: string;
  estimatedDeliveryTime: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutDataSubject = new BehaviorSubject<CheckoutData>({
    deliveryAddress: null,
    paymentMethod: null,
    deliveryInstructions: '',
    estimatedDeliveryTime: null
  });

  private currentStepSubject = new BehaviorSubject<number>(0);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  private steps: CheckoutStep[] = [
    { id: 'address', title: 'Delivery Address', isCompleted: false, isActive: true },
    { id: 'payment', title: 'Payment Method', isCompleted: false, isActive: false },
    { id: 'review', title: 'Review Order', isCompleted: false, isActive: false },
    { id: 'confirmation', title: 'Order Confirmation', isCompleted: false, isActive: false }
  ];

  constructor(private orderService: OrderService) {}

  get checkoutData$(): Observable<CheckoutData> {
    return this.checkoutDataSubject.asObservable();
  }

  get currentStep$(): Observable<number> {
    return this.currentStepSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get currentCheckoutData(): CheckoutData {
    return this.checkoutDataSubject.value;
  }

  get currentStep(): number {
    return this.currentStepSubject.value;
  }

  getSteps(): CheckoutStep[] {
    return [...this.steps];
  }

  setDeliveryAddress(address: DeliveryAddress): void {
    const currentData = this.currentCheckoutData;
    this.checkoutDataSubject.next({
      ...currentData,
      deliveryAddress: address,
      estimatedDeliveryTime: this.calculateEstimatedDeliveryTime()
    });
    this.completeStep(0);
  }

  setPaymentMethod(paymentMethod: PaymentMethod): void {
    const currentData = this.currentCheckoutData;
    this.checkoutDataSubject.next({
      ...currentData,
      paymentMethod
    });
    this.completeStep(1);
  }

  setDeliveryInstructions(instructions: string): void {
    const currentData = this.currentCheckoutData;
    this.checkoutDataSubject.next({
      ...currentData,
      deliveryInstructions: instructions
    });
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.updateStepStates(stepIndex);
      this.currentStepSubject.next(stepIndex);
    }
  }

  nextStep(): void {
    const currentStep = this.currentStep;
    if (currentStep < this.steps.length - 1) {
      this.goToStep(currentStep + 1);
    }
  }

  previousStep(): void {
    const currentStep = this.currentStep;
    if (currentStep > 0) {
      this.goToStep(currentStep - 1);
    }
  }

  private completeStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].isCompleted = true;
      this.updateStepStates(stepIndex + 1);
    }
  }

  private updateStepStates(activeStepIndex: number): void {
    this.steps.forEach((step, index) => {
      step.isActive = index === activeStepIndex;
    });
  }

  canProceedToNextStep(): boolean {
    const currentStep = this.currentStep;
    const data = this.currentCheckoutData;

    switch (currentStep) {
      case 0: // Address step
        return data.deliveryAddress !== null;
      case 1: // Payment step
        return data.paymentMethod !== null;
      case 2: // Review step
        return data.deliveryAddress !== null && data.paymentMethod !== null;
      default:
        return false;
    }
  }

  placeOrder(cart: Cart): Observable<Order> {
    this.loadingSubject.next(true);

    const checkoutData = this.currentCheckoutData;

    if (!checkoutData.deliveryAddress || !checkoutData.paymentMethod) {
      throw new Error('Missing required checkout information');
    }

    const order: Order = {
      id: this.generateOrderId(),
      orderNumber: this.generateOrderNumber(),
      customerId: cart.userId,
      restaurantId: cart.restaurantId,
      status: OrderStatus.PENDING,
      items: cart.items.map(cartItem => ({
        id: cartItem.id,
        menuItemId: cartItem.menuItem.id,
        name: cartItem.menuItem.name,
        price: cartItem.menuItem.price,
        quantity: cartItem.quantity,
        customizations: cartItem.customizations.map(customization => ({
          name: customization.customizationId, // In real app, would resolve to name
          options: customization.optionIds, // In real app, would resolve to option names
          additionalPrice: 0 // Would calculate from customizations
        })),
        specialInstructions: cartItem.specialInstructions,
        totalPrice: cartItem.totalPrice
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      paymentMethod: checkoutData.paymentMethod,
      deliveryAddress: checkoutData.deliveryAddress,
      specialInstructions: checkoutData.deliveryInstructions,
      estimatedDeliveryTime: checkoutData.estimatedDeliveryTime || new Date(Date.now() + 30 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          status: OrderStatus.PENDING,
          timestamp: new Date(),
          message: 'Order placed successfully',
          updatedBy: 'system'
        }
      ]
    };

    // Create order through order service
    return this.orderService.createOrder(order).pipe(
      delay(1000) // Additional processing time
    );
  }

  resetCheckout(): void {
    this.checkoutDataSubject.next({
      deliveryAddress: null,
      paymentMethod: null,
      deliveryInstructions: '',
      estimatedDeliveryTime: null
    });

    this.steps.forEach((step, index) => {
      step.isCompleted = false;
      step.isActive = index === 0;
    });

    this.currentStepSubject.next(0);
    this.loadingSubject.next(false);
  }

  private calculateEstimatedDeliveryTime(): Date {
    // Calculate estimated delivery time (30-45 minutes from now)
    const now = new Date();
    const estimatedMinutes = 30 + Math.floor(Math.random() * 15); // 30-45 minutes
    return new Date(now.getTime() + estimatedMinutes * 60 * 1000);
  }

  private generateOrderId(): string {
    return 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private generateOrderNumber(): string {
    // Generate a human-readable order number
    const prefix = 'RA'; // Restaurant App
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Mock address data
  getMockAddresses(): Address[] {
    return [
      {
        id: 'addr-1',
        label: 'Home',
        street: '123 Main Street, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        isDefault: true
      },
      {
        id: 'addr-2',
        label: 'Work',
        street: '456 Business Ave, Suite 200',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'USA',
        coordinates: { latitude: 40.7589, longitude: -73.9851 },
        isDefault: false
      },
      {
        id: 'addr-3',
        label: 'Mom\'s House',
        street: '789 Family Lane',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        country: 'USA',
        coordinates: { latitude: 40.6892, longitude: -73.9442 },
        isDefault: false
      }
    ];
  }

  convertAddressToDeliveryAddress(address: Address, instructions?: string): DeliveryAddress {
    return {
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      coordinates: address.coordinates || { latitude: 0, longitude: 0 },
      deliveryInstructions: instructions
    };
  }
}
