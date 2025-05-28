import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { MenuCategory, MenuItem, MenuFilters, CustomizationType, Allergen } from '../models/menu.model';
import { LocalizedMockDataService } from './localized-mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private categoriesSubject = new BehaviorSubject<MenuCategory[]>([]);
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private localizedDataService: LocalizedMockDataService) {}

  get categories$(): Observable<MenuCategory[]> {
    return this.categoriesSubject.asObservable();
  }

  get menuItems$(): Observable<MenuItem[]> {
    return this.menuItemsSubject.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  getMenuByRestaurantId(restaurantId: string): Observable<{categories: MenuCategory[], items: MenuItem[]}> {
    this.loadingSubject.next(true);

    const mockData = this.getMockMenuData(restaurantId);

    return of(mockData).pipe(
      delay(500) // Simulate API delay
    );
  }

  getMenuItemById(itemId: string): Observable<MenuItem | null> {
    const allItems = this.getAllMockMenuItems();
    const item = allItems.find(item => item.id === itemId);

    return of(item || null).pipe(delay(200));
  }

  getMenuItemsByCategory(restaurantId: string, categoryId: string): Observable<MenuItem[]> {
    this.loadingSubject.next(true);

    const items = this.getAllMockMenuItems().filter(
      item => item.restaurantId === restaurantId && item.categoryId === categoryId
    );

    return of(items).pipe(delay(300));
  }

  searchMenuItems(restaurantId: string, query: string): Observable<MenuItem[]> {
    this.loadingSubject.next(true);

    const items = this.getAllMockMenuItems()
      .filter(item => item.restaurantId === restaurantId)
      .filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

    return of(items).pipe(delay(300));
  }

  filterMenuItems(restaurantId: string, filters: MenuFilters): Observable<MenuItem[]> {
    this.loadingSubject.next(true);

    let items = this.getAllMockMenuItems().filter(item => item.restaurantId === restaurantId);

    if (filters.categoryId) {
      items = items.filter(item => item.categoryId === filters.categoryId);
    }

    if (filters.isVegetarian) {
      items = items.filter(item => item.isVegetarian);
    }

    if (filters.isVegan) {
      items = items.filter(item => item.isVegan);
    }

    if (filters.isGlutenFree) {
      items = items.filter(item => item.isGlutenFree);
    }

    if (filters.priceRange) {
      items = items.filter(item =>
        item.price >= filters.priceRange!.min && item.price <= filters.priceRange!.max
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    if (filters.allergens && filters.allergens.length > 0) {
      items = items.filter(item =>
        !item.allergens.some(allergen => filters.allergens!.includes(allergen))
      );
    }

    return of(items).pipe(delay(300));
  }

  private getMockMenuData(restaurantId: string): {categories: MenuCategory[], items: MenuItem[]} {
    const categories = this.getMockCategories(restaurantId);
    const items = this.getAllMockMenuItems().filter(item => item.restaurantId === restaurantId);

    return { categories, items };
  }

  // Method to refresh data when language changes
  refreshData(): void {
    // This will be called when language changes to refresh menu data
  }

  private getMockCategories(restaurantId: string): MenuCategory[] {
    const baseCategories = this.getBaseCategoriesData(restaurantId);

    // Apply localized content
    return baseCategories.map(category => {
      const localizedData = this.localizedDataService.getLocalizedMenuCategory(category.id);
      if (localizedData) {
        return {
          ...category,
          name: localizedData.name,
          description: localizedData.description
        };
      }
      return category;
    });
  }

  private getBaseCategoriesData(restaurantId: string): MenuCategory[] {
    const categoriesMap: Record<string, MenuCategory[]> = {
      '1': [ // Pizza Palace
        {
          id: 'cat-1-1',
          name: 'Appetizers',
          description: 'Start your meal with our delicious appetizers',
          image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=400&h=300&fit=crop',
          sortOrder: 1,
          isActive: true,
          restaurantId: '1'
        },
        {
          id: 'cat-1-2',
          name: 'Pizzas',
          description: 'Our signature wood-fired pizzas',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
          sortOrder: 2,
          isActive: true,
          restaurantId: '1'
        },
        {
          id: 'cat-1-3',
          name: 'Pasta',
          description: 'Fresh homemade pasta dishes',
          image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
          sortOrder: 3,
          isActive: true,
          restaurantId: '1'
        },
        {
          id: 'cat-1-4',
          name: 'Desserts',
          description: 'Sweet endings to your meal',
          image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
          sortOrder: 4,
          isActive: true,
          restaurantId: '1'
        }
      ],
      '2': [ // Burger Barn
        {
          id: 'cat-2-1',
          name: 'Starters',
          description: 'Crispy and delicious starters',
          sortOrder: 1,
          isActive: true,
          restaurantId: '2'
        },
        {
          id: 'cat-2-2',
          name: 'Burgers',
          description: 'Gourmet burgers made with premium beef',
          sortOrder: 2,
          isActive: true,
          restaurantId: '2'
        },
        {
          id: 'cat-2-3',
          name: 'Sides',
          description: 'Perfect sides to complement your meal',
          sortOrder: 3,
          isActive: true,
          restaurantId: '2'
        },
        {
          id: 'cat-2-4',
          name: 'Beverages',
          description: 'Refreshing drinks and shakes',
          sortOrder: 4,
          isActive: true,
          restaurantId: '2'
        }
      ],
      '3': [ // Sushi Zen
        {
          id: 'cat-3-1',
          name: 'Appetizers',
          description: 'Traditional Japanese starters',
          sortOrder: 1,
          isActive: true,
          restaurantId: '3'
        },
        {
          id: 'cat-3-2',
          name: 'Sushi Rolls',
          description: 'Fresh sushi rolls made to order',
          sortOrder: 2,
          isActive: true,
          restaurantId: '3'
        },
        {
          id: 'cat-3-3',
          name: 'Sashimi',
          description: 'Premium fresh fish sashimi',
          sortOrder: 3,
          isActive: true,
          restaurantId: '3'
        },
        {
          id: 'cat-3-4',
          name: 'Hot Dishes',
          description: 'Cooked Japanese specialties',
          sortOrder: 4,
          isActive: true,
          restaurantId: '3'
        }
      ]
    };

    return categoriesMap[restaurantId] || [];
  }

  private getAllMockMenuItems(): MenuItem[] {
    const baseItems = this.getBaseMenuItemsData();

    // Apply localized content
    return baseItems.map(item => {
      const localizedData = this.localizedDataService.getLocalizedMenuItem(item.id);
      if (localizedData) {
        return {
          ...item,
          name: localizedData.name,
          description: localizedData.description,
          tags: localizedData.tags,
          customizations: item.customizations.map((customization, index) => {
            const localizedCustomization = localizedData.customizations[index];
            if (localizedCustomization) {
              return {
                ...customization,
                name: localizedCustomization.name,
                options: customization.options.map((option, optIndex) => {
                  const localizedOption = localizedCustomization.options[optIndex];
                  if (localizedOption) {
                    return {
                      ...option,
                      name: localizedOption.name
                    };
                  }
                  return option;
                })
              };
            }
            return customization;
          })
        };
      }
      return item;
    });
  }

  private getBaseMenuItemsData(): MenuItem[] {
    return [
      // Pizza Palace Items
      {
        id: 'item-1-1',
        name: 'Garlic Bread',
        description: 'Fresh baked bread with garlic butter and herbs',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop',
        categoryId: 'cat-1-1',
        restaurantId: '1',
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [Allergen.WHEAT],
        customizations: [
          {
            id: 'cust-1',
            name: 'Extra Garlic',
            type: CustomizationType.SINGLE_SELECT,
            isRequired: false,
            options: [
              { id: 'opt-1', name: 'No Extra', price: 0, isDefault: true },
              { id: 'opt-2', name: 'Extra Garlic', price: 1.00, isDefault: false }
            ]
          }
        ],
        preparationTime: 10,
        calories: 280,
        tags: ['Popular', 'Vegetarian'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'item-1-2',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
        categoryId: 'cat-1-2',
        restaurantId: '1',
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [Allergen.WHEAT, Allergen.DAIRY],
        customizations: [
          {
            id: 'cust-2',
            name: 'Size',
            type: CustomizationType.SINGLE_SELECT,
            isRequired: true,
            options: [
              { id: 'opt-3', name: 'Small (10")', price: 0, isDefault: true },
              { id: 'opt-4', name: 'Medium (12")', price: 3.00, isDefault: false },
              { id: 'opt-5', name: 'Large (14")', price: 6.00, isDefault: false }
            ]
          },
          {
            id: 'cust-3',
            name: 'Extra Toppings',
            type: CustomizationType.MULTI_SELECT,
            isRequired: false,
            options: [
              { id: 'opt-6', name: 'Extra Cheese', price: 2.00, isDefault: false },
              { id: 'opt-7', name: 'Mushrooms', price: 1.50, isDefault: false },
              { id: 'opt-8', name: 'Olives', price: 1.50, isDefault: false }
            ]
          }
        ],
        preparationTime: 15,
        calories: 320,
        tags: ['Popular', 'Vegetarian', 'Classic'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'item-1-3',
        name: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        categoryId: 'cat-1-3',
        restaurantId: '1',
        isAvailable: true,
        isPopular: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [Allergen.WHEAT, Allergen.DAIRY, Allergen.EGGS],
        customizations: [],
        preparationTime: 18,
        calories: 420,
        tags: ['Popular', 'Classic'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'item-1-4',
        name: 'Tiramisu',
        description: 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
        categoryId: 'cat-1-4',
        restaurantId: '1',
        isAvailable: true,
        isPopular: false,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [Allergen.DAIRY, Allergen.EGGS],
        customizations: [],
        preparationTime: 5,
        calories: 350,
        tags: ['Dessert', 'Vegetarian'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      // Burger Barn Items
      {
        id: 'item-2-1',
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheese, lettuce, tomato, and our special sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        categoryId: 'cat-2-2',
        restaurantId: '2',
        isAvailable: true,
        isPopular: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [Allergen.WHEAT, Allergen.DAIRY],
        customizations: [
          {
            id: 'cust-4',
            name: 'Cooking Level',
            type: CustomizationType.SINGLE_SELECT,
            isRequired: true,
            options: [
              { id: 'opt-9', name: 'Medium', price: 0, isDefault: true },
              { id: 'opt-10', name: 'Medium Rare', price: 0, isDefault: false },
              { id: 'opt-11', name: 'Well Done', price: 0, isDefault: false }
            ]
          }
        ],
        preparationTime: 12,
        calories: 580,
        tags: ['Popular', 'Classic'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'item-2-2',
        name: 'Crispy Fries',
        description: 'Golden crispy french fries seasoned with sea salt',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
        categoryId: 'cat-2-3',
        restaurantId: '2',
        isAvailable: true,
        isPopular: true,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [],
        customizations: [],
        preparationTime: 8,
        calories: 320,
        tags: ['Popular', 'Vegan', 'Side'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      // Sushi Zen Items
      {
        id: 'item-3-1',
        name: 'California Roll',
        description: 'Fresh crab, avocado, and cucumber wrapped in nori and rice',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        categoryId: 'cat-3-2',
        restaurantId: '3',
        isAvailable: true,
        isPopular: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: false,
        allergens: [Allergen.SHELLFISH],
        customizations: [],
        preparationTime: 15,
        calories: 250,
        tags: ['Popular', 'Gluten Free'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'item-3-2',
        name: 'Salmon Sashimi',
        description: 'Fresh Atlantic salmon sliced thin and served with wasabi',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop',
        categoryId: 'cat-3-3',
        restaurantId: '3',
        isAvailable: true,
        isPopular: true,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: false,
        allergens: [Allergen.FISH],
        customizations: [],
        preparationTime: 10,
        calories: 180,
        tags: ['Popular', 'Premium', 'Gluten Free'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      }
    ];
  }
}
