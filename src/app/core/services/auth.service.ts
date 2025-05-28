import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'restaurant-app-user';
  private readonly TOKEN_KEY = 'restaurant-app-token';
  
  private userSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeAuth();
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private initializeAuth(): void {
    const savedUser = this.getSavedUser();
    const savedToken = this.getSavedToken();
    
    if (savedUser && savedToken) {
      this.userSubject.next(savedUser);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<{user: User; token: string}> {
    // Mock login - in real app, this would call an API
    const mockUsers = this.getMockUsers();
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      const token = this.generateMockToken();
      this.setAuthData(user, token);
      return of({ user, token });
    }
    
    throw new Error('Invalid credentials');
  }

  logout(): void {
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.clearAuthData();
  }

  register(userData: Partial<User>): Observable<{user: User; token: string}> {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: this.generateId(),
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      phone: userData.phone!,
      role: userData.role || UserRole.CUSTOMER,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const token = this.generateMockToken();
    this.setAuthData(newUser, token);
    return of({ user: newUser, token });
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  isCustomer(): boolean {
    return this.hasRole(UserRole.CUSTOMER);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isDeliveryPerson(): boolean {
    return this.hasRole(UserRole.DELIVERY);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser: User = {
      ...currentUser,
      ...userData,
      updatedAt: new Date()
    };

    this.userSubject.next(updatedUser);
    this.saveUser(updatedUser);
    return of(updatedUser);
  }

  private setAuthData(user: User, token: string): void {
    this.userSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.saveUser(user);
    this.saveToken(token);
  }

  private clearAuthData(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private getSavedUser(): User | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.USER_KEY);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  }

  private getSavedToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private saveUser(user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private saveToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private generateMockToken(): string {
    return 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getMockUsers(): User[] {
    return [
      {
        id: '1',
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        role: UserRole.CUSTOMER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567891',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        email: 'delivery@example.com',
        firstName: 'Delivery',
        lastName: 'Person',
        phone: '+1234567892',
        role: UserRole.DELIVERY,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
