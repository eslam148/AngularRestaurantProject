import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SimpleI18nService } from '../../../core/services/simple-i18n.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  @Input() collapsed = false;

  expandedItems: Set<string> = new Set();
  sidebarItems: SidebarItem[] = [];

  constructor(
    public i18nService: SimpleI18nService,
    private router: Router
  ) {
    this.initializeSidebarItems();
  }

  private initializeSidebarItems(): void {
    this.sidebarItems = [
      {
        id: 'dashboard',
        label: this.i18nService.translate('admin.nav.dashboard'),
        icon: 'dashboard',
        route: '/admin/dashboard'
      },
      {
        id: 'restaurants',
        label: this.i18nService.translate('admin.nav.restaurants'),
        icon: 'restaurants',
        route: '/admin/restaurants'
      },
      {
        id: 'orders',
        label: this.i18nService.translate('admin.nav.orders'),
        icon: 'orders',
        route: '/admin/orders',
        badge: 5
      },
      {
        id: 'menu',
        label: this.i18nService.translate('admin.nav.menu'),
        icon: 'menu',
        route: '/admin/menu'
      },
      {
        id: 'users',
        label: this.i18nService.translate('admin.nav.users'),
        icon: 'users',
        route: '/admin/users'
      },
      {
        id: 'delivery',
        label: this.i18nService.translate('admin.nav.delivery'),
        icon: 'delivery',
        route: '/admin/delivery'
      },
      {
        id: 'analytics',
        label: this.i18nService.translate('admin.nav.analytics'),
        icon: 'analytics',
        route: '/admin/analytics'
      },
      {
        id: 'settings',
        label: this.i18nService.translate('admin.nav.settings'),
        icon: 'settings',
        route: '/admin/settings'
      }
    ];
  }

  toggleExpanded(itemId: string): void {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
  }

  isExpanded(itemId: string): boolean {
    return this.expandedItems.has(itemId);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }


}
