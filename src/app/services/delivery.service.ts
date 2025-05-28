import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, switchMap, catchError, of } from 'rxjs';
import { 
  OrderForDeliveryDto, 
  OrderDetailsDto, 
  DeliveryStatsDto, 
  DeliveryPersonnelDto,
  LocationDto,
  DeliveryUpdateDto,
  EarningsDto,
  NotificationDto,
  OrderStatus,
  OrderStatusFilterDto,
  DeliveryRouteDto
} from '../models/delivery-dto';
import { ResponseStatus } from '../models/response';

interface ApiResponse<T> {
  data: T;
  status: ResponseStatus;
  message: string;
  internalMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private baseUrl = 'https://restaurants.runasp.net/api';
  
  // Real-time state management
  private ordersSubject = new BehaviorSubject<OrderForDeliveryDto[]>([]);
  private statsSubject = new BehaviorSubject<DeliveryStatsDto>({
    todayDeliveries: 0,
    pendingOrders: 0,
    completedToday: 0,
    earnings: 0,
    rating: 0,
    totalDistance: 0,
    averageDeliveryTime: 0,
    onTimeDeliveryRate: 0
  });
  private currentLocationSubject = new BehaviorSubject<LocationDto | null>(null);
  private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);
  private isOnlineSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  public orders$ = this.ordersSubject.asObservable();
  public stats$ = this.statsSubject.asObservable();
  public currentLocation$ = this.currentLocationSubject.asObservable();
  public notifications$ = this.notificationsSubject.asObservable();
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeRealTimeUpdates();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Initialize real-time updates
  private initializeRealTimeUpdates(): void {
    // Poll for updates every 30 seconds when online
    this.isOnline$.pipe(
      switchMap(isOnline => 
        isOnline ? interval(30000) : of(null)
      )
    ).subscribe(() => {
      if (this.isOnlineSubject.value) {
        this.refreshOrders();
        this.refreshStats();
        this.refreshNotifications();
      }
    });
  }

  // Order Management
  getAllOrdersForDelivery(): Observable<ApiResponse<OrderForDeliveryDto[]>> {
    return this.http.get<ApiResponse<OrderForDeliveryDto[]>>(
      `${this.baseUrl}/Delivery/GetAllDeliveries`,
      { headers: this.getHeaders() }
    );
  }

  getOrderDetailsForDelivery(orderId: number): Observable<ApiResponse<OrderDetailsDto>> {
    return this.http.get<ApiResponse<OrderDetailsDto>>(
      `${this.baseUrl}/Delivery/GetOrderDetailsForDelivery?id=${orderId}`,
      { headers: this.getHeaders() }
    );
  }

  getOrdersByStatus(filterDto: OrderStatusFilterDto): Observable<ApiResponse<OrderForDeliveryDto[]>> {
    return this.http.post<ApiResponse<OrderForDeliveryDto[]>>(
      `${this.baseUrl}/Delivery/filter-by-status`,
      filterDto,
      { headers: this.getHeaders() }
    );
  }

  getOrdersByDelivery(deliveryId: number): Observable<ApiResponse<OrderForDeliveryDto[]>> {
    return this.http.post<ApiResponse<OrderForDeliveryDto[]>>(
      `${this.baseUrl}/Delivery/by-delivery`,
      { deliveryId },
      { headers: this.getHeaders() }
    );
  }

  // Order Status Updates
  updateOrderStatusToPending(orderId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/UpdateOrderStatusFromPindingtoOntheWay?id=${orderId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  updateOrderStatusToDelivered(orderId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/UpdateOrderStatusFromPindingtoDevlived?id=${orderId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  updateOrderStatusToCancelled(orderId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/UpdateOrderStatusFromPindingtoCancelled?id=${orderId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Enhanced order status update with location
  updateOrderWithLocation(updateDto: DeliveryUpdateDto): Observable<ApiResponse<boolean>> {
    // This would be a new endpoint to implement
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/UpdateOrderWithLocation`,
      updateDto,
      { headers: this.getHeaders() }
    );
  }

  // Location Services
  updateCurrentLocation(location: LocationDto): void {
    this.currentLocationSubject.next(location);
    // Send location to backend
    this.sendLocationUpdate(location).subscribe();
  }

  private sendLocationUpdate(location: LocationDto): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/UpdateLocation`,
      location,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Failed to update location:', error);
        return of({ data: false, status: ResponseStatus.BadRequest, message: 'Failed to update location' });
      })
    );
  }

  getCurrentLocation(): Promise<LocationDto> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location: LocationDto = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date()
            };
            this.updateCurrentLocation(location);
            resolve(location);
          },
          (error) => reject(error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        reject(new Error('Geolocation is not supported'));
      }
    });
  }

  // Stats and Analytics
  getDeliveryStats(): Observable<ApiResponse<DeliveryStatsDto>> {
    return this.http.get<ApiResponse<DeliveryStatsDto>>(
      `${this.baseUrl}/Delivery/GetStats`,
      { headers: this.getHeaders() }
    );
  }

  getEarnings(period: 'daily' | 'weekly' | 'monthly' = 'daily'): Observable<ApiResponse<EarningsDto>> {
    return this.http.get<ApiResponse<EarningsDto>>(
      `${this.baseUrl}/Delivery/GetEarnings?period=${period}`,
      { headers: this.getHeaders() }
    );
  }

  // Online/Offline Status
  setOnlineStatus(isOnline: boolean): Observable<ApiResponse<boolean>> {
    this.isOnlineSubject.next(isOnline);
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/SetOnlineStatus`,
      { isOnline },
      { headers: this.getHeaders() }
    );
  }

  // Notifications
  getNotifications(): Observable<ApiResponse<NotificationDto[]>> {
    return this.http.get<ApiResponse<NotificationDto[]>>(
      `${this.baseUrl}/Delivery/GetNotifications`,
      { headers: this.getHeaders() }
    );
  }

  markNotificationAsRead(notificationId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.baseUrl}/Delivery/MarkNotificationRead?id=${notificationId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // Route Optimization
  getOptimizedRoute(orderIds: number[]): Observable<ApiResponse<DeliveryRouteDto[]>> {
    return this.http.post<ApiResponse<DeliveryRouteDto[]>>(
      `${this.baseUrl}/Delivery/GetOptimizedRoute`,
      { orderIds },
      { headers: this.getHeaders() }
    );
  }

  // Real-time data refresh methods
  refreshOrders(): void {
    this.getAllOrdersForDelivery().subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success && response.data) {
          this.ordersSubject.next(response.data);
        }
      },
      error: (error) => console.error('Failed to refresh orders:', error)
    });
  }

  refreshStats(): void {
    this.getDeliveryStats().subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success && response.data) {
          this.statsSubject.next(response.data);
        }
      },
      error: (error) => console.error('Failed to refresh stats:', error)
    });
  }

  refreshNotifications(): void {
    this.getNotifications().subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success && response.data) {
          this.notificationsSubject.next(response.data);
        }
      },
      error: (error) => console.error('Failed to refresh notifications:', error)
    });
  }

  // Utility methods
  getOrderStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending: return '#ffc107';
      case OrderStatus.Preparing: return '#17a2b8';
      case OrderStatus.ReadyForPickup: return '#fd7e14';
      case OrderStatus.PickedUp: return '#6f42c1';
      case OrderStatus.OnTheWay: return '#007bff';
      case OrderStatus.Delivered: return '#28a745';
      case OrderStatus.Cancelled: return '#dc3545';
      default: return '#6c757d';
    }
  }

  getOrderStatusIcon(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending: return '⏳';
      case OrderStatus.Preparing: return '👨‍🍳';
      case OrderStatus.ReadyForPickup: return '📦';
      case OrderStatus.PickedUp: return '🚚';
      case OrderStatus.OnTheWay: return '🛣️';
      case OrderStatus.Delivered: return '✅';
      case OrderStatus.Cancelled: return '❌';
      default: return '❓';
    }
  }
}
