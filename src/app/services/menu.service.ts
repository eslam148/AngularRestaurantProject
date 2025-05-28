import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of } from 'rxjs';
import { MenuItemDTO, CategoryDTO, MenuCategoryDTO } from '../models/menu-dto';
import { Response, ResponseStatus } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseUrl = 'https://restaurants.runasp.net/api';
  
  // State management
  private menuItemsSubject = new BehaviorSubject<MenuItemDTO[]>([]);
  private categoriesSubject = new BehaviorSubject<CategoryDTO[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Public observables
  menuItems$ = this.menuItemsSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Menu Items Management
  getAllMenuItems(restaurantId?: number): Observable<Response<MenuItemDTO[]>> {
    this.loadingSubject.next(true);
    const url = restaurantId 
      ? `${this.baseUrl}/Menu/restaurant/${restaurantId}`
      : `${this.baseUrl}/Menu`;
    
    return this.http.get<Response<MenuItemDTO[]>>(url, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuItemDTO[]>('getAllMenuItems', []))
      );
  }

  getMenuItemById(id: number): Observable<Response<MenuItemDTO>> {
    return this.http.get<Response<MenuItemDTO>>(`${this.baseUrl}/Menu/${id}`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuItemDTO>('getMenuItemById'))
      );
  }

  addMenuItem(menuItem: Partial<MenuItemDTO>): Observable<Response<MenuItemDTO>> {
    return this.http.post<Response<MenuItemDTO>>(`${this.baseUrl}/Menu`, menuItem, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuItemDTO>('addMenuItem'))
      );
  }

  updateMenuItem(id: number, menuItem: Partial<MenuItemDTO>): Observable<Response<MenuItemDTO>> {
    return this.http.put<Response<MenuItemDTO>>(`${this.baseUrl}/Menu/${id}`, menuItem, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuItemDTO>('updateMenuItem'))
      );
  }

  deleteMenuItem(id: number): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.baseUrl}/Menu/${id}`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<boolean>('deleteMenuItem'))
      );
  }

  // Categories Management
  getAllCategories(): Observable<Response<CategoryDTO[]>> {
    return this.http.get<Response<CategoryDTO[]>>(`${this.baseUrl}/Menu/categories`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<CategoryDTO[]>('getAllCategories', []))
      );
  }

  addCategory(category: Partial<CategoryDTO>): Observable<Response<CategoryDTO>> {
    return this.http.post<Response<CategoryDTO>>(`${this.baseUrl}/Menu/categories`, category, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<CategoryDTO>('addCategory'))
      );
  }

  updateCategory(id: number, category: Partial<CategoryDTO>): Observable<Response<CategoryDTO>> {
    return this.http.put<Response<CategoryDTO>>(`${this.baseUrl}/Menu/categories/${id}`, category, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<CategoryDTO>('updateCategory'))
      );
  }

  deleteCategory(id: number): Observable<Response<boolean>> {
    return this.http.delete<Response<boolean>>(`${this.baseUrl}/Menu/categories/${id}`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<boolean>('deleteCategory'))
      );
  }

  // Menu by Restaurant
  getMenuByRestaurant(restaurantId: number): Observable<Response<MenuCategoryDTO[]>> {
    return this.http.get<Response<MenuCategoryDTO[]>>(`${this.baseUrl}/Restaurant/${restaurantId}/menu`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuCategoryDTO[]>('getMenuByRestaurant', []))
      );
  }

  // Search and Filter
  searchMenuItems(query: string, restaurantId?: number): Observable<Response<MenuItemDTO[]>> {
    const params = new URLSearchParams();
    params.append('query', query);
    if (restaurantId) {
      params.append('restaurantId', restaurantId.toString());
    }

    return this.http.get<Response<MenuItemDTO[]>>(`${this.baseUrl}/Menu/search?${params}`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuItemDTO[]>('searchMenuItems', []))
      );
  }

  getMenuItemsByCategory(categoryId: number, restaurantId?: number): Observable<Response<MenuItemDTO[]>> {
    const params = new URLSearchParams();
    params.append('categoryId', categoryId.toString());
    if (restaurantId) {
      params.append('restaurantId', restaurantId.toString());
    }

    return this.http.get<Response<MenuItemDTO[]>>(`${this.baseUrl}/Menu/category?${params}`, 
      { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError<MenuItemDTO[]>('getMenuItemsByCategory', []))
      );
  }

  // State management methods
  refreshMenuItems(restaurantId?: number): void {
    this.getAllMenuItems(restaurantId).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          this.menuItemsSubject.next(response.data);
        }
        this.loadingSubject.next(false);
      },
      error: () => this.loadingSubject.next(false)
    });
  }

  refreshCategories(): void {
    this.getAllCategories().subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.Success) {
          this.categoriesSubject.next(response.data);
        }
      }
    });
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
