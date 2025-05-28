import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of } from 'rxjs';
import { OrderDTO, OrderForDeliveryDto, OrderDetailsDto, OrderStatus, OrderItemDTO } from '../models/order-dto';
import { CartItemDTO } from '../models/menu-dto';
import { Response, ResponseStatus } from '../models/response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://restaurants.runasp.net/api';
  private customerUrl = `${this.baseUrl}/Customer`;
  private deliveryUrl = `${this.baseUrl}/Delivery`;

  // State management
  private ordersSubject = new BehaviorSubject<OrderDTO[]>([]);
  private cartSubject = new BehaviorSubject<CartItemDTO[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private cartTotalSubject = new BehaviorSubject<number>(0);

  // Public observables
  orders$ = this.ordersSubject.asObservable();
  cart$ = this.cartSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  cartTotal$ = this.cartTotalSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Enhanced Customer Order Management
  placeOrder(order: OrderDTO): Observable<Response<OrderDTO>> {
    this.loadingSubject.next(true);
    return this.http.post<Response<OrderDTO>>(`${this.customerUrl}/AddOrder`, order,
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<OrderDTO>('placeOrder'))
      );
  }

  getAllOrders(): Observable<Response<OrderDTO[]>> {
    this.loadingSubject.next(true);
    return this.http.get<Response<OrderDTO[]>>(`${this.customerUrl}/GetAllOrders`,
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<OrderDTO[]>('getAllOrders', []))
      );
  }

  getOrderById(id: number): Observable<Response<OrderDTO>> {
    return this.http.get<Response<OrderDTO>>(`${this.customerUrl}/GetOrder/${id}`,
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<OrderDTO>('getOrderById'))
      );
  }

  cancelOrder(orderId: number, reason?: string): Observable<Response<boolean>> {
    return this.http.put<Response<boolean>>(`${this.customerUrl}/CancelOrder/${orderId}`,
      { reason }, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<boolean>('cancelOrder'))
      );
  }

  // Cart Management
  addToCart(item: CartItemDTO): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.findIndex(
      cartItem => cartItem.menuItemId === item.menuItemId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      currentCart[existingItemIndex].quantity += item.quantity;
      currentCart[existingItemIndex].totalPrice =
        currentCart[existingItemIndex].quantity * currentCart[existingItemIndex].menuItem.price;
    } else {
      // Add new item
      currentCart.push(item);
    }

    this.updateCart(currentCart);
  }

  removeFromCart(menuItemId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.menuItemId !== menuItemId);
    this.updateCart(updatedCart);
  }

  updateCartItemQuantity(menuItemId: number, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.menuItemId === menuItemId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeFromCart(menuItemId);
      } else {
        currentCart[itemIndex].quantity = quantity;
        currentCart[itemIndex].totalPrice = quantity * currentCart[itemIndex].menuItem.price;
        this.updateCart(currentCart);
      }
    }
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  private updateCart(cart: CartItemDTO[]): void {
    this.cartSubject.next(cart);
    this.calculateCartTotal(cart);
    this.saveCartToStorage(cart);
  }

  private calculateCartTotal(cart: CartItemDTO[]): void {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    this.cartTotalSubject.next(total);
  }

  private saveCartToStorage(cart: CartItemDTO[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart) as CartItemDTO[];
        this.cartSubject.next(cart);
        this.calculateCartTotal(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.clearCart();
      }
    }
  }

  // Delivery endpoints (existing functionality)
  getAllDeliveries(): Observable<Response<OrderForDeliveryDto[]>> {
    return this.http.get<Response<OrderForDeliveryDto[]>>(`${this.deliveryUrl}/GetAllDeliveries`,
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<OrderForDeliveryDto[]>('getAllDeliveries', []))
      );
  }

  getOrderDetails(id: number): Observable<Response<OrderDetailsDto>> {
    return this.http.get<Response<OrderDetailsDto>>(`${this.deliveryUrl}/GetOrderDetailsForDelivery/${id}`,
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<OrderDetailsDto>('getOrderDetails'))
      );
  }

  updateOrderStatus(id: number, status: string): Observable<Response<any>> {
    const endpoint = this.getStatusUpdateEndpoint(status);
    return this.http.put<Response<any>>(`${this.deliveryUrl}/${endpoint}/${id}`, {},
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<any>('updateOrderStatus'))
      );
  }

  private getStatusUpdateEndpoint(status: string): string {
    switch (status.toLowerCase()) {
      case 'ontheway':
        return 'UpdateOrderStatusFromPindingtoOntheWay';
      case 'delivered':
        return 'UpdateOrderStatusFromPindingtoDevlived';
      case 'cancelled':
        return 'UpdateOrderStatusFromPindingtoCancelled';
      default:
        throw new Error('Invalid status');
    }
  }

  // State management methods
  refreshOrders(): void {
    this.getAllOrders().subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          this.ordersSubject.next(response.data);
        }
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }

  // Utility methods
  createOrderFromCart(restaurantId: number, deliveryAddressId: number, paymentId?: number): Partial<OrderDTO> {
    const cart = this.cartSubject.value;
    const items: OrderItemDTO[] = cart.map(cartItem => ({
      id: 0,
      menuItemId: cartItem.menuItemId,
      quantity: cartItem.quantity,
      price: cartItem.menuItem.price,
      notes: cartItem.specialInstructions
    }));

    return {
      id: 0,
      customerId: 0, // Will be set by backend
      restaurantId,
      items,
      totalAmount: this.cartTotalSubject.value,
      orderStatus: OrderStatus.Pending,
      deliveryAddressId,
      paymentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<Response<T>> => {
      console.error(`${operation} failed:`, error);

      return of({
        data: result as T,
        status: ResponseStatus.BadRequest,
        message: `${operation} failed. Please try again.`,
        internalMessage: error.message
      });
    };
  }
}
