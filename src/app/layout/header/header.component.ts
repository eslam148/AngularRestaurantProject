import { Component, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { SimpleI18nService, Language } from '../../core/services/simple-i18n.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { User, UserRole } from '../../core/models/user.model';
import { LanguageSelectorComponent } from '../../shared/components/language-selector/language-selector.component';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentTheme: Theme = 'light';
  currentLanguage: Language = 'en';
  currentUser: User | null = null;
  isAuthenticated = false;
  cartCount = 0;

  // Expose enums to template
  UserRole = UserRole;

  constructor(
    private themeService: ThemeService,
    private i18nService: SimpleI18nService,
    private authService: AuthService,
    private cartService: CartService
  ) {
    // Use effect for language changes
    effect(() => {
      this.currentLanguage = this.i18nService.language();
    });
  }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    // Subscribe to auth changes
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });

    // Subscribe to cart changes
    this.cartService.cartCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.cartCount = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.i18nService.toggleLanguage();
  }

  logout(): void {
    this.authService.logout();
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return '';
  }

  getUserRoleRoute(): string {
    if (!this.currentUser) return '/';

    switch (this.currentUser.role) {
      case UserRole.CUSTOMER:
        return '/customer';
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.DELIVERY:
        return '/delivery';
      default:
        return '/';
    }
  }
}
