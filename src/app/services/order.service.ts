import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDTO, OrderForDeliveryDto, OrderDetailsDto } from '../models/order-dto';
import { Response } from '../models/response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/Customer`;
  private deliveryUrl = `${environment.apiUrl}/Delivery`;

  constructor(private http: HttpClient) { }

  // Customer endpoints
  placeOrder(order: OrderDTO): Observable<Response<OrderDTO>> {
    return this.http.post<Response<OrderDTO>>(`${this.baseUrl}/AddOrder`, order);
  }

  getAllOrders(): Observable<Response<OrderDTO[]>> {
    return this.http.get<Response<OrderDTO[]>>(`${this.baseUrl}/GetAllOrders`);
  }

  // Delivery endpoints
  getAllDeliveries(): Observable<Response<OrderForDeliveryDto[]>> {
    return this.http.get<Response<OrderForDeliveryDto[]>>(`${this.deliveryUrl}/GetAllDeliveries`);
  }

  getOrderDetails(id: number): Observable<Response<OrderDetailsDto>> {
    return this.http.get<Response<OrderDetailsDto>>(`${this.deliveryUrl}/GetOrderDetailsForDelivery/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<Response<any>> {
    const endpoint = this.getStatusUpdateEndpoint(status);
    return this.http.put<Response<any>>(`${this.deliveryUrl}/${endpoint}/${id}`, {});
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
}
