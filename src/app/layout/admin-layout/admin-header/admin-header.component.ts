import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimpleI18nService } from '../../../core/services/simple-i18n.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  @Output() sidebarToggle = new EventEmitter<boolean>();
  
  sidebarCollapsed = false;
  showUserMenu = false;

  constructor(
    public i18nService: SimpleI18nService,
    public themeService: ThemeService
  ) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarToggle.emit(this.sidebarCollapsed);
  }

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

  logout(): void {
    // Implement logout logic
    console.log('Admin logout');
  }
}
