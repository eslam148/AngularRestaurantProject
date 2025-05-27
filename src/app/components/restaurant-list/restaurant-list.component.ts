import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { RestaurantDTO } from '../../models/restaurant-dto';
import { ResponseStatus } from '../../models/response';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RestaurantListComponent implements OnInit {
  restaurants: RestaurantDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  private loadRestaurants(): void {
    this.loading = true;
    this.error = null;

    this.restaurantService.getAllRestaurants()
      .subscribe({
        next: (response) => {
          if (response.status === ResponseStatus.Success && response.data) {
            this.restaurants = response.data;
            console.log('Restaurants loaded:', this.restaurants);
          } else {
            this.error = response.message;
          }
        },
        error: (error) => {
          this.error = 'Failed to load restaurants. Please try again later.';
          console.error('Error loading restaurants:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
