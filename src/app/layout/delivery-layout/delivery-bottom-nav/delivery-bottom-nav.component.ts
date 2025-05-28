import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SimpleI18nService } from '../../../core/services/simple-i18n.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-delivery-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-bottom-nav.component.html',
  styleUrl: './delivery-bottom-nav.component.css'
})
export class DeliveryBottomNavComponent {
  navItems: NavItem[] = [];

  constructor(
    public i18nService: SimpleI18nService,
    private router: Router
  ) {
    this.initializeNavItems();
  }

  private initializeNavItems(): void {
    this.navItems = [
      {
        id: 'dashboard',
        label: this.i18nService.translate('delivery.nav.dashboard'),
        icon: 'dashboard',
        route: '/delivery/dashboard'
      },
      {
        id: 'orders',
        label: this.i18nService.translate('delivery.nav.orders'),
        icon: 'orders',
        route: '/delivery/orders',
        badge: 3
      },
      {
        id: 'map',
        label: this.i18nService.translate('delivery.nav.map'),
        icon: 'map',
        route: '/delivery/map'
      },
      {
        id: 'earnings',
        label: this.i18nService.translate('delivery.nav.earnings'),
        icon: 'earnings',
        route: '/delivery/earnings'
      },
      {
        id: 'profile',
        label: this.i18nService.translate('delivery.nav.profile'),
        icon: 'profile',
        route: '/delivery/profile'
      }
    ];
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }


}
