import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerDTO, CustomerProfileDTO } from '../models/customer-dto';
import { environment } from '../../environments/environment';
import { Response } from './../models/response';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = `${environment.apiUrl}/Customer`;

  constructor(private http: HttpClient) { }

  getCurrentProfile(): Observable<Response<CustomerProfileDTO>> {
    return this.http.get<Response<CustomerProfileDTO>>(`${this.baseUrl}/CurrentProfile`);
  }

  getCustomerDetails(id: number): Observable<Response<CustomerDTO>> {
    return this.http.get<Response<CustomerDTO>>(`${this.baseUrl}/Details/${id}`);
  }

  updateProfile(profile: CustomerDTO): Observable<Response<boolean>> {
    return this.http.put<Response<boolean>>(`${this.baseUrl}/UpdateProfile`, profile);
  }

  deleteProfile(): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.baseUrl}/DeleteProfile`);
  }
}
