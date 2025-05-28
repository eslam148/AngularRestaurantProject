import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SimpleI18nService } from '../../../../core/services/simple-i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { RestaurantService } from '../../../../core/services/restaurant.service';
import { Restaurant } from '../../../../core/models/restaurant.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  featuredRestaurants: Restaurant[] = [];
  loading = false;

  get offers() {
    return [
      {
        id: '1',
        title: this.translate('offers.freeDelivery.title') || 'Free Delivery',
        description: this.translate('offers.freeDelivery.description') || 'On orders over $25',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=200&fit=crop',
        code: 'FREEDEL25'
      },
      {
        id: '2',
        title: this.translate('offers.discount.title') || '20% Off',
        description: this.translate('offers.discount.description') || 'First order discount',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
        code: 'FIRST20'
      }
    ];
  }

  constructor(
    private i18nService: SimpleI18nService,
    private themeService: ThemeService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedRestaurants();
  }

  private loadFeaturedRestaurants(): void {
    this.loading = true;
    this.restaurantService.getFeaturedRestaurants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (restaurants) => {
          this.featuredRestaurants = restaurants;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading featured restaurants:', error);
          this.loading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  translate(key: string): string {
    return this.i18nService.translate(key);
  }

  isRTL(): boolean {
    return this.i18nService.isRTL();
  }
}
