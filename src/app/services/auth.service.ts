import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginDTO, LoginResponseDTO } from '../models/login-dto';
import { RegisterDTO } from '../models/register-dto';

interface Response<T> {
    data: T;
    status: ResponseStatus;
    message: string;
    internalMessage?: string;
}

enum ResponseStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    BadRequest = 'BadRequest'
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
    private currentUserSubject = new BehaviorSubject<any>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.checkAuthStatus();
    }

    login(loginData: LoginDTO): Observable<Response<LoginResponseDTO>> {
        return this.http.post<Response<LoginResponseDTO>>(`${this.baseUrl}/Account/login`, loginData);
    }

    register(registerData: RegisterDTO): Observable<Response<boolean>> {
        return this.http.post<Response<boolean>>(`${this.baseUrl}/Account/register`, registerData);
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
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private checkAuthStatus(): void {
        const token = this.getToken();
        const refreshToken = this.getRefreshToken();

        if (token && refreshToken) {
            // TODO: Validate token and refresh if necessary
            this.refreshToken({ token, refreshToken }).subscribe({
                next: (response) => {
                    if (response.status === ResponseStatus.Success) {
                        this.setTokens(response.data, refreshToken);
                    } else {
                        this.logout();
                    }
                },
                error: () => this.logout()
            });
        }
    }
}
