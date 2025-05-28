import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, interval, map, switchMap } from 'rxjs';
import { Order, OrderStatus, OrderTimeline, PaymentMethodType } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ORDERS_STORAGE_KEY = 'restaurant-app-orders';

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.loadOrdersFromStorage();
    this.startOrderStatusSimulation();
  }

  get orders$(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  get currentOrder$(): Observable<Order | null> {
    return this.currentOrderSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get orders(): Order[] {
    return this.ordersSubject.value;
  }

  // Create new order
  createOrder(order: Order): Observable<Order> {
    this.loadingSubject.next(true);

    // Add initial timeline entry
    order.timeline = [
      {
        status: OrderStatus.PENDING,
        timestamp: new Date(),
        message: 'Order placed successfully',
        updatedBy: 'system'
      }
    ];

    // Add to orders list
    const orders = [order, ...this.orders];
    this.ordersSubject.next(orders);
    this.currentOrderSubject.next(order);
    this.saveOrdersToStorage();

    return of(order).pipe(
      delay(1000) // Simulate API delay
    );
  }

  // Get order by ID
  getOrderById(orderId: string): Observable<Order | null> {
    this.loadingSubject.next(true);

    const order = this.orders.find(o => o.id === orderId);

    if (order) {
      this.currentOrderSubject.next(order);
    }

    return of(order || null).pipe(
      delay(300)
    );
  }

  // Get orders by customer ID
  getOrdersByCustomerId(customerId: string): Observable<Order[]> {
    this.loadingSubject.next(true);

    const customerOrders = this.orders.filter(order => order.customerId === customerId);

    return of(customerOrders).pipe(
      delay(500)
    );
  }

  // Get recent orders (last 30 days)
  getRecentOrders(customerId: string): Observable<Order[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = this.orders.filter(order =>
      order.customerId === customerId &&
      order.createdAt >= thirtyDaysAgo
    );

    return of(recentOrders).pipe(delay(300));
  }

  // Update order status
  updateOrderStatus(orderId: string, status: OrderStatus, message?: string): Observable<Order | null> {
    const orders = [...this.orders];
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return of(null);
    }

    const order = { ...orders[orderIndex] };
    order.status = status;
    order.updatedAt = new Date();

    // Add timeline entry
    const timelineEntry: OrderTimeline = {
      status,
      timestamp: new Date(),
      message: message || this.getDefaultStatusMessage(status),
      updatedBy: 'system'
    };

    order.timeline = [...order.timeline, timelineEntry];

    // Update estimated delivery time for certain statuses
    if (status === OrderStatus.CONFIRMED) {
      order.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    } else if (status === OrderStatus.PREPARING) {
      order.estimatedDeliveryTime = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes
    } else if (status === OrderStatus.OUT_FOR_DELIVERY) {
      order.estimatedDeliveryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    }

    orders[orderIndex] = order;
    this.ordersSubject.next(orders);

    // Update current order if it's the same
    if (this.currentOrderSubject.value?.id === orderId) {
      this.currentOrderSubject.next(order);
    }

    this.saveOrdersToStorage();

    return of(order).pipe(delay(200));
  }

  // Cancel order
  cancelOrder(orderId: string, reason?: string): Observable<Order | null> {
    return this.updateOrderStatus(
      orderId,
      OrderStatus.CANCELLED,
      reason || 'Order cancelled by customer'
    );
  }

  // Reorder (create new order based on existing order)
  reorder(orderId: string): Observable<Order | null> {
    const existingOrder = this.orders.find(o => o.id === orderId);

    if (!existingOrder) {
      return of(null);
    }

    const newOrder: Order = {
      ...existingOrder,
      id: this.generateOrderId(),
      orderNumber: this.generateOrderNumber(),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: []
    };

    return this.createOrder(newOrder);
  }

  // Get order status progress
  getOrderProgress(order: Order): { current: number; total: number; percentage: number } {
    const statusOrder = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED
    ];

    const currentIndex = statusOrder.indexOf(order.status);
    const total = statusOrder.length;
    const current = currentIndex + 1;
    const percentage = ((current / total) * 100);

    return { current, total, percentage };
  }

  // Check if order can be cancelled
  canCancelOrder(order: Order): boolean {
    return [OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status);
  }

  // Check if order can be tracked
  canTrackOrder(order: Order): boolean {
    return ![OrderStatus.CANCELLED, OrderStatus.DELIVERED].includes(order.status);
  }

  // Get estimated delivery time remaining
  getDeliveryTimeRemaining(order: Order): string {
    if (!order.estimatedDeliveryTime || order.status === OrderStatus.DELIVERED) {
      return '';
    }

    const now = new Date();
    const estimatedTime = new Date(order.estimatedDeliveryTime);
    const diffMs = estimatedTime.getTime() - now.getTime();

    if (diffMs <= 0) {
      return 'Any moment now';
    }

    const diffMinutes = Math.ceil(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  }

  private getDefaultStatusMessage(status: OrderStatus): string {
    const messages: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Order placed and waiting for confirmation',
      [OrderStatus.CONFIRMED]: 'Order confirmed by restaurant',
      [OrderStatus.PREPARING]: 'Your order is being prepared',
      [OrderStatus.READY_FOR_PICKUP]: 'Order is ready for pickup',
      [OrderStatus.OUT_FOR_DELIVERY]: 'Order is out for delivery',
      [OrderStatus.DELIVERED]: 'Order delivered successfully',
      [OrderStatus.CANCELLED]: 'Order has been cancelled',
      [OrderStatus.REFUNDED]: 'Order has been refunded'
    };

    return messages[status] || 'Order status updated';
  }

  private generateOrderId(): string {
    return 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  private generateOrderNumber(): string {
    const prefix = 'RA';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Storage methods
  private saveOrdersToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    }
  }

  private loadOrdersFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(this.ORDERS_STORAGE_KEY);
      if (stored) {
        try {
          const orders = JSON.parse(stored);
          // Convert date strings back to Date objects
          const processedOrders = orders.map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            estimatedDeliveryTime: order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime) : null,
            timeline: order.timeline.map((entry: any) => ({
              ...entry,
              timestamp: new Date(entry.timestamp)
            }))
          }));
          this.ordersSubject.next(processedOrders);
        } catch (error) {
          console.error('Error loading orders from storage:', error);
        }
      }
    }
  }

  // Simulate order status updates for demo purposes
  private startOrderStatusSimulation(): void {
    // Update order statuses every 30 seconds for demo
    interval(30000).pipe(
      switchMap(() => this.orders$),
      map(orders => orders.filter(order => this.canTrackOrder(order)))
    ).subscribe(activeOrders => {
      activeOrders.forEach(order => {
        // Randomly progress orders for demo
        if (Math.random() < 0.3) { // 30% chance to progress
          this.progressOrderStatus(order);
        }
      });
    });
  }

  private progressOrderStatus(order: Order): void {
    const statusProgression: Partial<Record<OrderStatus, OrderStatus>> = {
      [OrderStatus.PENDING]: OrderStatus.CONFIRMED,
      [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
      [OrderStatus.PREPARING]: OrderStatus.OUT_FOR_DELIVERY,
      [OrderStatus.OUT_FOR_DELIVERY]: OrderStatus.DELIVERED
    };

    const nextStatus = statusProgression[order.status];
    if (nextStatus) {
      this.updateOrderStatus(order.id, nextStatus).subscribe();
    }
  }

  // Mock data for demonstration
  createMockOrders(): void {
    const mockOrders: Order[] = [
      {
        id: 'order-demo-1',
        orderNumber: 'RA123456',
        customerId: 'guest',
        restaurantId: '1',
        status: OrderStatus.OUT_FOR_DELIVERY,
        items: [
          {
            id: 'item-1',
            menuItemId: 'item-1-2',
            name: 'Margherita Pizza',
            price: 14.99,
            quantity: 1,
            customizations: [],
            totalPrice: 14.99
          }
        ],
        subtotal: 14.99,
        tax: 1.20,
        deliveryFee: 2.99,
        total: 19.18,
        paymentMethod: { id: PaymentMethodType.CASH, name: 'Cash on Delivery' },
        deliveryAddress: {
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000),
        timeline: [
          {
            status: OrderStatus.PENDING,
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            message: 'Order placed successfully',
            updatedBy: 'system'
          },
          {
            status: OrderStatus.CONFIRMED,
            timestamp: new Date(Date.now() - 18 * 60 * 1000),
            message: 'Order confirmed by Pizza Palace',
            updatedBy: 'restaurant'
          },
          {
            status: OrderStatus.PREPARING,
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            message: 'Your pizza is being prepared',
            updatedBy: 'restaurant'
          },
          {
            status: OrderStatus.OUT_FOR_DELIVERY,
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            message: 'Order is out for delivery',
            updatedBy: 'delivery'
          }
        ]
      }
    ];

    const existingOrders = this.orders;
    const allOrders = [...mockOrders, ...existingOrders];
    this.ordersSubject.next(allOrders);
    this.saveOrdersToStorage();
  }
}
