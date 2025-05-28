import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { Restaurant } from '../../../../core/models/restaurant.model';

@Component({
  selector: 'app-admin-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent {
  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  showAddModal = false;

  constructor(
    public i18nService: SimpleI18nService,
    private mockDataService: MockDataService
  ) {
    this.initializeData();
  }

  private initializeData(): void {
    this.restaurants = this.mockDataService.getMockRestaurants();
    this.filteredRestaurants = [...this.restaurants];
  }

  filterRestaurants(): void {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           restaurant.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.selectedStatus === 'all' ||
                           (this.selectedStatus === 'open' && restaurant.isOpen) ||
                           (this.selectedStatus === 'closed' && !restaurant.isOpen);

      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(): void {
    this.filterRestaurants();
  }

  onStatusChange(): void {
    this.filterRestaurants();
  }

  toggleRestaurantStatus(restaurant: Restaurant): void {
    restaurant.isOpen = !restaurant.isOpen;
    this.filterRestaurants();
  }

  editRestaurant(restaurant: Restaurant): void {
    console.log('Editing restaurant:', restaurant.id);
    // TODO: Implement edit functionality
  }

  deleteRestaurant(restaurant: Restaurant): void {
    if (confirm(this.i18nService.translate('admin.restaurants.confirmDelete') || 'Are you sure you want to delete this restaurant?')) {
      this.restaurants = this.restaurants.filter(r => r.id !== restaurant.id);
      this.filterRestaurants();
    }
  }

  addNewRestaurant(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  getStatusClass(isOpen: boolean): string {
    return isOpen ? 'status-open' : 'status-closed';
  }

  getStatusText(isOpen: boolean): string {
    return isOpen
      ? this.i18nService.translate('admin.restaurants.status.open') || 'Open'
      : this.i18nService.translate('admin.restaurants.status.closed') || 'Closed';
  }

  getRatingStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    return stars;
  }
}
