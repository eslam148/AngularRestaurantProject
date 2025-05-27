import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentDTO } from '../models/payment-dto';
import { Response } from '../models/response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/Customer`;

  constructor(private http: HttpClient) { }

  addPayment(payment: PaymentDTO): Observable<Response<PaymentDTO>> {
    return this.http.post<Response<PaymentDTO>>(`${this.baseUrl}/AddPayment`, payment);
  }

  getAllPayments(): Observable<Response<PaymentDTO[]>> {
    return this.http.get<Response<PaymentDTO[]>>(`${this.baseUrl}/GetAllPayments`);
  }
}
