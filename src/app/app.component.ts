import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DeliveryLayoutComponent } from './layouts/delivery-layout/delivery-layout.component';
import { LayoutService, LayoutType } from './services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CustomerLayoutComponent, AdminLayoutComponent, DeliveryLayoutComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  title = 'AngularRestaurantProject';
  currentLayout: LayoutType = LayoutType.CUSTOMER;
  LayoutType = LayoutType; // Make enum available in template

  constructor(
    public layoutService: LayoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen to layout service changes
    this.layoutService.currentLayout$
      .pipe(takeUntil(this.destroy$))
      .subscribe(layout => {
        this.currentLayout = layout;
      });

    // Listen to route changes and update layout accordingly
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updateLayoutFromRoute(event.url);
      });

    // Set initial layout based on current route
    this.updateLayoutFromRoute(this.router.url);
  }

  private updateLayoutFromRoute(url: string): void {
    console.log('App Component - Route changed to:', url);

    if (url.startsWith('/customer')) {
      this.layoutService.setCustomerLayout();
    } else if (url.startsWith('/admin')) {
      this.layoutService.setAdminLayout();
    } else if (url.startsWith('/delivery')) {
      this.layoutService.setDeliveryLayout();
    } else if (url === '/navigation-test' || url === '/login' || url === '/register') {
      // Keep current layout for these routes
    } else {
      // Default to customer layout for unknown routes
      this.layoutService.setCustomerLayout();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
