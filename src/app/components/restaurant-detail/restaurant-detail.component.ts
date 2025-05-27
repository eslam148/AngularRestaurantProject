import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantDTO, MenuItemDTO } from '../../models/restaurant-dto';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RestaurantDetailComponent implements OnInit {
  restaurant: RestaurantDTO | null = null;
  loading = false;
  error: string | null = null;
  selectedItems: { [key: number]: number } = {}; // menuItemId -> quantity

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadRestaurant(id);
    } else {
      this.router.navigate(['/restaurants']);
    }
  }

  private loadRestaurant(id: number): void {
    this.loading = true;
    this.error = null;

    this.restaurantService.getRestaurantById(id)
      .subscribe({
        next: (response) => {
          
          if (response.status === ResponseStatus.Success && response.data) {
            this.restaurant = response.data;
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load restaurant details. Please try again later.';
          console.error('Error loading restaurant:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  updateQuantity(item: MenuItemDTO, change: number): void {
    const currentQty = this.selectedItems[item.id] || 0;
    const newQty = Math.max(0, currentQty + change);

    if (newQty === 0) {
      delete this.selectedItems[item.id];
    } else {
      this.selectedItems[item.id] = newQty;
    }
  }

  getQuantity(itemId: number): number {
    return this.selectedItems[itemId] || 0;
  }

  getTotalPrice(): number {
    if (!this.restaurant) return 0;

    return this.restaurant.menuItems.reduce((total, item) => {
      const quantity = this.selectedItems[item.id] || 0;
      return total + (item.price * quantity);
    }, 0);
  }

  placeOrder(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // TODO: Navigate to order confirmation page with selected items
    console.log('Selected items:', this.selectedItems);
  }
}
