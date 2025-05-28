import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum LayoutType {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  DELIVERY = 'delivery'
}

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private currentLayoutSubject = new BehaviorSubject<LayoutType>(LayoutType.CUSTOMER);
  public currentLayout$: Observable<LayoutType> = this.currentLayoutSubject.asObservable();

  constructor() {}

  setLayout(layout: LayoutType): void {
    this.currentLayoutSubject.next(layout);
  }

  getCurrentLayout(): LayoutType {
    return this.currentLayoutSubject.value;
  }

  setCustomerLayout(): void {
    this.setLayout(LayoutType.CUSTOMER);
  }

  setAdminLayout(): void {
    this.setLayout(LayoutType.ADMIN);
  }

  setDeliveryLayout(): void {
    this.setLayout(LayoutType.DELIVERY);
  }

  isCustomerLayout(): boolean {
    return this.getCurrentLayout() === LayoutType.CUSTOMER;
  }

  isAdminLayout(): boolean {
    return this.getCurrentLayout() === LayoutType.ADMIN;
  }

  isDeliveryLayout(): boolean {
    return this.getCurrentLayout() === LayoutType.DELIVERY;
  }
}
