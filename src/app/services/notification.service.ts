import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  showSuccess(message: string, title: string = 'Success', duration: number = 5000): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  }

  showError(message: string, title: string = 'Error', persistent: boolean = false): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? 0 : 8000
    });
  }

  showWarning(message: string, title: string = 'Warning', duration: number = 6000): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  showInfo(message: string, title: string = 'Info', duration: number = 4000): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }

  private addNotification(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = { ...notification, id };
    
    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, newNotification]);

    // Auto-remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications$.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications$.next(filteredNotifications);
  }

  clearAll(): void {
    this.notifications$.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
