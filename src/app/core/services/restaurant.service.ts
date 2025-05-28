import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Restaurant, RestaurantFilters, CuisineType, PriceRange } from '../models/restaurant.model';
import { LocalizedMockDataService } from './localized-mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurantsSubject = new BehaviorSubject<Restaurant[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private localizedDataService: LocalizedMockDataService) {
    this.loadMockData();
  }

  get restaurants$(): Observable<Restaurant[]> {
    return this.restaurantsSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  getRestaurants(filters?: RestaurantFilters): Observable<Restaurant[]> {
    this.loadingSubject.next(true);

    let restaurants = this.getMockRestaurants();

    if (filters) {
      restaurants = this.applyFilters(restaurants, filters);
    }

    return of(restaurants).pipe(
      delay(500), // Simulate API delay
    );
  }

  getRestaurantById(id: string): Observable<Restaurant | null> {
    this.loadingSubject.next(true);

    const restaurant = this.getMockRestaurants().find(r => r.id === id);

    return of(restaurant || null).pipe(
      delay(300)
    );
  }

  getFeaturedRestaurants(): Observable<Restaurant[]> {
    const featured = this.getMockRestaurants()
      .filter(r => r.isFeatured)
      .slice(0, 6);

    return of(featured).pipe(delay(200));
  }

  searchRestaurants(query: string): Observable<Restaurant[]> {
    this.loadingSubject.next(true);

    const results = this.getMockRestaurants().filter(restaurant =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );

    return of(results).pipe(delay(300));
  }

  private applyFilters(restaurants: Restaurant[], filters: RestaurantFilters): Restaurant[] {
    return restaurants.filter(restaurant => {
      // Cuisine filter
      if (filters.cuisine && filters.cuisine.length > 0) {
        const hasMatchingCuisine = restaurant.cuisine.some(c =>
          filters.cuisine!.includes(c)
        );
        if (!hasMatchingCuisine) return false;
      }

      // Price range filter
      if (filters.priceRange && filters.priceRange.length > 0) {
        if (!filters.priceRange.includes(restaurant.priceRange)) return false;
      }

      // Rating filter
      if (filters.rating && restaurant.rating < filters.rating) {
        return false;
      }

      // Open status filter
      if (filters.isOpen !== undefined && restaurant.isOpen !== filters.isOpen) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = restaurant.name.toLowerCase().includes(query);
        const matchesDescription = restaurant.description.toLowerCase().includes(query);
        const matchesCuisine = restaurant.cuisine.some(c =>
          c.toLowerCase().includes(query)
        );

        if (!matchesName && !matchesDescription && !matchesCuisine) {
          return false;
        }
      }

      return true;
    });
  }

  private loadMockData(): void {
    const restaurants = this.getMockRestaurants();
    this.restaurantsSubject.next(restaurants);
    this.loadingSubject.next(false);
  }

  // Method to refresh data when language changes
  refreshData(): void {
    this.loadMockData();
  }

  private getMockRestaurants(): Restaurant[] {
    const baseRestaurants = this.getBaseRestaurantData();

    // Apply localized content
    return baseRestaurants.map(restaurant => {
      const localizedData = this.localizedDataService.getLocalizedRestaurant(restaurant.id);
      if (localizedData) {
        return {
          ...restaurant,
          name: localizedData.name,
          description: localizedData.description,
          tags: localizedData.tags
        };
      }
      return restaurant;
    });
  }

  private getBaseRestaurantData(): Restaurant[] {
    return [
      {
        id: '1',
        name: 'Pizza Palace', // Will be replaced by localized data
        description: 'Authentic Italian pizza with fresh ingredients and traditional recipes', // Will be replaced
        cuisine: [CuisineType.ITALIAN, CuisineType.PIZZA],
        coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
        logo: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=200&h=200&fit=crop',
        rating: 4.5,
        reviewCount: 324,
        priceRange: PriceRange.MODERATE,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        minimumOrder: 15,
        isOpen: true,
        isFeatured: true,
        address: {
          street: '123 Main St',
          city: 'Downtown',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        contact: {
          phone: '+1-555-0123',
          email: 'info@pizzapalace.com',
          website: 'www.pizzapalace.com'
        },
        operatingHours: {
          monday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
          tuesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
          wednesday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
          thursday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
          friday: { isOpen: true, openTime: '11:00', closeTime: '24:00' },
          saturday: { isOpen: true, openTime: '11:00', closeTime: '24:00' },
          sunday: { isOpen: true, openTime: '12:00', closeTime: '22:00' }
        },
        deliveryZones: [],
        tags: ['Popular', 'Fast Delivery', 'Family Friendly'], // Will be replaced
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Burger Barn', // Will be replaced by localized data
        description: 'Gourmet burgers made with premium beef and fresh local ingredients', // Will be replaced
        cuisine: [CuisineType.AMERICAN, CuisineType.FAST_FOOD],
        coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
        logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop',
        rating: 4.3,
        reviewCount: 256,
        priceRange: PriceRange.MODERATE,
        deliveryTime: '20-30 min',
        deliveryFee: 1.99,
        minimumOrder: 12,
        isOpen: true,
        isFeatured: true,
        address: {
          street: '456 Oak Ave',
          city: 'Midtown',
          state: 'NY',
          zipCode: '10002',
          country: 'USA',
          coordinates: { latitude: 40.7589, longitude: -73.9851 }
        },
        contact: {
          phone: '+1-555-0124',
          email: 'hello@burgerbarn.com'
        },
        operatingHours: {
          monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
          friday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
          sunday: { isOpen: true, openTime: '11:00', closeTime: '21:00' }
        },
        deliveryZones: [],
        tags: ['Gourmet', 'Local Ingredients'], // Will be replaced
        createdAt: new Date('2023-02-20'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        name: 'Sushi Zen', // Will be replaced by localized data
        description: 'Fresh sushi and Japanese cuisine prepared by master chefs', // Will be replaced
        cuisine: [CuisineType.JAPANESE],
        coverImage: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
        logo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&fit=crop',
        rating: 4.7,
        reviewCount: 189,
        priceRange: PriceRange.EXPENSIVE,
        deliveryTime: '30-40 min',
        deliveryFee: 3.99,
        minimumOrder: 25,
        isOpen: true,
        isFeatured: true,
        address: {
          street: '789 Pine St',
          city: 'Uptown',
          state: 'NY',
          zipCode: '10003',
          country: 'USA',
          coordinates: { latitude: 40.7831, longitude: -73.9712 }
        },
        contact: {
          phone: '+1-555-0125',
          email: 'orders@sushizen.com',
          website: 'www.sushizen.com'
        },
        operatingHours: {
          monday: { isOpen: false, openTime: '', closeTime: '' },
          tuesday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
          wednesday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
          thursday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
          friday: { isOpen: true, openTime: '17:00', closeTime: '23:00' },
          saturday: { isOpen: true, openTime: '17:00', closeTime: '23:00' },
          sunday: { isOpen: true, openTime: '17:00', closeTime: '21:00' }
        },
        deliveryZones: [],
        tags: ['Premium', 'Fresh Fish', 'Master Chef'], // Will be replaced
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2024-01-05')
      }
    ];
  }
}
