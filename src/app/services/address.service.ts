import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressDTO } from '../models/address-dto';
import { Response } from '../models/response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {  private baseUrl = `${environment.apiUrl}/Customer`;

  constructor(private http: HttpClient) { }

  addAddress(address: AddressDTO): Observable<Response<AddressDTO>> {
    return this.http.post<Response<AddressDTO>>(`${this.baseUrl}/AddAddresses`, address);
  }

  getAllAddresses(): Observable<Response<AddressDTO[]>> {
    return this.http.get<Response<AddressDTO[]>>(`${this.baseUrl}/GetAllAddresses`);
  }

  updateAddress(address: AddressDTO): Observable<Response<AddressDTO>> {
    return this.http.put<Response<AddressDTO>>(`${this.baseUrl}/UpdateAddress`, address);
  }

  deleteAddress(id: number): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.baseUrl}/DeleteAddress/${id}`);
  }

  setDefaultAddress(id: number): Observable<Response<boolean>> {
    return this.http.put<Response<boolean>>(`${this.baseUrl}/SetDefaultAddress/${id}`, {});
  }
}
