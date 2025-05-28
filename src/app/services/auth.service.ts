import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginDTO, LoginResponseDTO } from '../models/login-dto';
import { RegisterDTO } from '../models/register-dto';
import { LayoutService, LayoutType } from './layout.service';
import { ResponseStatus } from '../models/response-status.enum';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailConfirmed: boolean;
}

interface Response<T> {
    data: T;
    status: ResponseStatus;
    message: string;
    internalMessage?: string;
}



interface RefreshTokenDto {
    token: string;
    refreshToken: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'https://restaurants.runasp.net/api';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

    currentUser$ = this.currentUserSubject.asObservable();
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router,
        private layoutService: LayoutService
    ) {
        this.checkAuthStatus();
    }

    login(loginData: LoginDTO): Observable<Response<LoginResponseDTO>> {
        return this.http.post<Response<LoginResponseDTO>>(`${this.baseUrl}/Account/login`, loginData)
            .pipe(
                tap(response => {
                    if (response.status === ResponseStatus.Success) {
                        this.handleSuccessfulLogin(response.data);
                    }
                })
            );
    }

    register(registerData: RegisterDTO): Observable<Response<boolean>> {
        return this.http.post<Response<boolean>>(`${this.baseUrl}/Account/register`, registerData);
    }

    private handleSuccessfulLogin(loginResponse: LoginResponseDTO): void {
        // Store tokens
        this.setTokens(loginResponse.token, loginResponse.refreshToken);

        // Decode user info from token or use response data
        const user: User = {
            id: loginResponse.userId || '',
            email: loginResponse.email || '',
            firstName: loginResponse.firstName || '',
            lastName: loginResponse.lastName || '',
            role: loginResponse.role || 'Customer',
            isEmailConfirmed: loginResponse.isEmailConfirmed || false
        };

        this.setCurrentUser(user);
        this.redirectUserBasedOnRole(user.role);
    }

    private redirectUserBasedOnRole(role: string): void {
        switch (role.toLowerCase()) {
            case 'admin':
                this.layoutService.setAdminLayout();
                this.router.navigate(['/admin/dashboard']);
                break;
            case 'delivery':
            case 'deliverydriver':
                this.layoutService.setDeliveryLayout();
                this.router.navigate(['/delivery/dashboard']);
                break;
            case 'customer':
            default:
                this.layoutService.setCustomerLayout();
                this.router.navigate(['/customer/menu']);
                break;
        }
    }

    refreshToken(tokenData: RefreshTokenDto): Observable<Response<string>> {
        return this.http.post<Response<string>>(`${this.baseUrl}/Account/refresh-token`, tokenData);
    }

    confirmEmail(userId: string, otp: number): Observable<Response<boolean>> {
        return this.http.post<Response<boolean>>(`${this.baseUrl}/Account/Confirm-Email-otp`, { userId, otp });
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    setTokens(token: string, refreshToken: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.layoutService.setCustomerLayout();
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    setCurrentUser(user: User | null): void {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(!!user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    // Role-based methods
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.role?.toLowerCase() === role.toLowerCase();
    }

    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    isCustomer(): boolean {
        return this.hasRole('customer');
    }

    isDeliveryDriver(): boolean {
        return this.hasRole('delivery') || this.hasRole('deliverydriver');
    }

    getUserRole(): string | null {
        return this.getCurrentUser()?.role || null;
    }

    private checkAuthStatus(): void {
        const token = this.getToken();
        const refreshToken = this.getRefreshToken();
        const storedUser = localStorage.getItem('user');

        if (token && refreshToken) {
            // Restore user from localStorage if available
            if (storedUser) {
                try {
                    const user: User = JSON.parse(storedUser);
                    this.currentUserSubject.next(user);
                    this.isAuthenticatedSubject.next(true);
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    this.logout();
                    return;
                }
            }

            // Validate token and refresh if necessary
            this.refreshToken({ token, refreshToken }).subscribe({
                next: (response) => {
                    if (response.status === ResponseStatus.Success) {
                        this.setTokens(response.data, refreshToken);
                        this.isAuthenticatedSubject.next(true);
                    } else {
                        this.logout();
                    }
                },
                error: () => this.logout()
            });
        } else {
            this.isAuthenticatedSubject.next(false);
        }
    }
}
