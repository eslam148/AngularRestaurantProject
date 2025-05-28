import { Injectable } from '@angular/core';
import { SimpleI18nService } from './simple-i18n.service';
import { RestaurantService } from './restaurant.service';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class DataRefreshService {

  constructor(
    private i18nService: SimpleI18nService,
    private restaurantService: RestaurantService,
    private menuService: MenuService
  ) {
    this.initializeLanguageListener();
  }

  private initializeLanguageListener(): void {
    this.i18nService.languageChange$.subscribe(() => {
      this.refreshAllData();
    });
  }

  private refreshAllData(): void {
    // Refresh restaurant data
    this.restaurantService.refreshData();
    
    // Refresh menu data
    this.menuService.refreshData();
  }
}
