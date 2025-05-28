import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LayoutService, LayoutType } from '../../services/layout.service';

@Component({
  selector: 'app-navigation-test',
  templateUrl: './navigation-test.component.html',
  styleUrls: ['./navigation-test.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavigationTestComponent {
  LayoutType = LayoutType;
  currentLayout$: any;

  constructor(
    private layoutService: LayoutService,
    private router: Router
  ) {
    this.currentLayout$ = this.layoutService.currentLayout$;
  }

  switchToCustomer(): void {
    this.layoutService.setCustomerLayout();
  }

  switchToAdmin(): void {
    this.layoutService.setAdminLayout();
  }

  switchToDelivery(): void {
    this.layoutService.setDeliveryLayout();
  }

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }
}
