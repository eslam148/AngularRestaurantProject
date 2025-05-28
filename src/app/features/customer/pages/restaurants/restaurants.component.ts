import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Restaurant, RestaurantFilters, CuisineType, PriceRange } from '../../../../core/models/restaurant.model';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrl: './restaurants.component.css'
})
export class RestaurantsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  restaurants: Restaurant[] = [];
  filteredRestaurants: Restaurant[] = [];
  loading = false;

  // Filter properties
  searchQuery = '';
  selectedCuisines: CuisineType[] = [];
  selectedPriceRanges: PriceRange[] = [];
  minRating = 0;
  showOpenOnly = false;
  sortBy = 'rating'; // rating, deliveryTime, name

  // Filter options
  cuisineTypes = Object.values(CuisineType);
  priceRanges = Object.values(PriceRange);
  ratingOptions = [0, 3, 4, 4.5];

  // UI state
  showFilters = false;

  constructor(
    private restaurantService: RestaurantService,
    private i18nService: SimpleI18nService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRestaurants(): void {
    this.loading = true;
    this.restaurantService.getRestaurants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (restaurants) => {
          this.restaurants = restaurants;
          this.applyFiltersAndSort();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading restaurants:', error);
          this.loading = false;
        }
      });
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.searchQuery = query;
      this.applyFiltersAndSort();
    });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  onCuisineToggle(cuisine: CuisineType): void {
    const index = this.selectedCuisines.indexOf(cuisine);
    if (index > -1) {
      this.selectedCuisines.splice(index, 1);
    } else {
      this.selectedCuisines.push(cuisine);
    }
    this.applyFiltersAndSort();
  }

  onPriceRangeToggle(priceRange: PriceRange): void {
    const index = this.selectedPriceRanges.indexOf(priceRange);
    if (index > -1) {
      this.selectedPriceRanges.splice(index, 1);
    } else {
      this.selectedPriceRanges.push(priceRange);
    }
    this.applyFiltersAndSort();
  }

  onRatingChange(): void {
    this.applyFiltersAndSort();
  }

  onOpenOnlyToggle(): void {
    this.showOpenOnly = !this.showOpenOnly;
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCuisines = [];
    this.selectedPriceRanges = [];
    this.minRating = 0;
    this.showOpenOnly = false;
    this.applyFiltersAndSort();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  private applyFiltersAndSort(): void {
    let filtered = [...this.restaurants];

    // Apply filters
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(query))
      );
    }

    if (this.selectedCuisines.length > 0) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine.some(c => this.selectedCuisines.includes(c))
      );
    }

    if (this.selectedPriceRanges.length > 0) {
      filtered = filtered.filter(restaurant =>
        this.selectedPriceRanges.includes(restaurant.priceRange)
      );
    }

    if (this.minRating > 0) {
      filtered = filtered.filter(restaurant => restaurant.rating >= this.minRating);
    }

    if (this.showOpenOnly) {
      filtered = filtered.filter(restaurant => restaurant.isOpen);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          return this.parseDeliveryTime(a.deliveryTime) - this.parseDeliveryTime(b.deliveryTime);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    this.filteredRestaurants = filtered;
  }

  private parseDeliveryTime(deliveryTime: string): number {
    // Extract first number from "25-35 min" format
    const match = deliveryTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }

  getCuisineDisplayName(cuisine: CuisineType): string {
    return cuisine.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  isCuisineSelected(cuisine: CuisineType): boolean {
    return this.selectedCuisines.includes(cuisine);
  }

  isPriceRangeSelected(priceRange: PriceRange): boolean {
    return this.selectedPriceRanges.includes(priceRange);
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchQuery) count++;
    if (this.selectedCuisines.length > 0) count++;
    if (this.selectedPriceRanges.length > 0) count++;
    if (this.minRating > 0) count++;
    if (this.showOpenOnly) count++;
    return count;
  }

  trackByRestaurant(index: number, restaurant: Restaurant): string {
    return restaurant.id;
  }
}
