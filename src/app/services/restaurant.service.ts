import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestaurantDTO } from '../models/restaurant-dto';
import { Response } from '../models/response';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = `${environment.apiUrl}/Restaurant`;

  constructor(private http: HttpClient) { }

  getAllRestaurants(): Observable<Response<RestaurantDTO[]>> {
    return this.http.get<Response<RestaurantDTO[]>>(this.baseUrl);
  }

  getRestaurantById(id: number): Observable<Response<RestaurantDTO>> {
    return this.http.get<Response<RestaurantDTO>>(`${this.baseUrl}/${id}`);
  }
}
