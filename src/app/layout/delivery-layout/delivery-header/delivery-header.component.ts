import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimpleI18nService } from '../../../core/services/simple-i18n.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-delivery-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-header.component.html',
  styleUrl: './delivery-header.component.css'
})
export class DeliveryHeaderComponent {
  showUserMenu = false;
  isOnline = true;

  constructor(
    public i18nService: SimpleI18nService,
    public themeService: ThemeService
  ) {}

  toggleLanguage(): void {
    const newLang = this.i18nService.currentLanguage === 'en' ? 'ar' : 'en';
    this.i18nService.setLanguage(newLang);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleOnlineStatus(): void {
    this.isOnline = !this.isOnline;
    // Implement online/offline logic
    console.log('Delivery status:', this.isOnline ? 'Online' : 'Offline');
  }

  logout(): void {
    // Implement logout logic
    console.log('Delivery logout');
  }
}
