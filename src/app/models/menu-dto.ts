// Menu-related DTOs for the restaurant application

export interface MenuItemDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  restaurantId: number;
  restaurantName?: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number; // in minutes
  calories?: number;
  allergens?: string[];
  ingredients?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: SpiceLevel;
  rating?: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoryDTO {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  restaurantId?: number;
  itemCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategoryDTO {
  category: CategoryDTO;
  items: MenuItemDTO[];
}

export interface CreateMenuItemDTO {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  restaurantId: number;
  imageUrl?: string;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
  ingredients?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: SpiceLevel;
}

export interface UpdateMenuItemDTO {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  preparationTime?: number;
  calories?: number;
  allergens?: string[];
  ingredients?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: SpiceLevel;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  restaurantId?: number;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface MenuSearchDTO {
  query?: string;
  categoryId?: number;
  restaurantId?: number;
  minPrice?: number;
  maxPrice?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: SpiceLevel;
  isAvailable?: boolean;
  sortBy?: MenuSortBy;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

export interface MenuFilterDTO {
  categories?: number[];
  priceRange?: {
    min: number;
    max: number;
  };
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
  };
  spiceLevel?: SpiceLevel;
  rating?: number;
  preparationTime?: number;
}

export interface CartItemDTO {
  menuItemId: number;
  menuItem: MenuItemDTO;
  quantity: number;
  specialInstructions?: string;
  selectedOptions?: MenuOptionDTO[];
  totalPrice: number;
}

export interface MenuOptionDTO {
  id: number;
  name: string;
  price: number;
  isRequired: boolean;
  optionGroupId: number;
}

export interface MenuOptionGroupDTO {
  id: number;
  name: string;
  isRequired: boolean;
  allowMultiple: boolean;
  options: MenuOptionDTO[];
}

export interface MenuItemWithOptionsDTO extends MenuItemDTO {
  optionGroups: MenuOptionGroupDTO[];
}

export interface MenuStatsDTO {
  totalItems: number;
  totalCategories: number;
  averagePrice: number;
  mostPopularItem?: MenuItemDTO;
  topRatedItem?: MenuItemDTO;
  recentlyAdded: MenuItemDTO[];
}

export interface MenuAnalyticsDTO {
  totalViews: number;
  totalOrders: number;
  revenue: number;
  topSellingItems: {
    item: MenuItemDTO;
    orderCount: number;
    revenue: number;
  }[];
  categoryPerformance: {
    category: CategoryDTO;
    orderCount: number;
    revenue: number;
  }[];
}

// Enums
export enum SpiceLevel {
  None = 'None',
  Mild = 'Mild',
  Medium = 'Medium',
  Hot = 'Hot',
  ExtraHot = 'ExtraHot'
}

export enum MenuSortBy {
  Name = 'Name',
  Price = 'Price',
  Rating = 'Rating',
  Popularity = 'Popularity',
  CreatedAt = 'CreatedAt',
  PreparationTime = 'PreparationTime'
}

export enum SortOrder {
  Ascending = 'Ascending',
  Descending = 'Descending'
}

export enum DietaryType {
  Vegetarian = 'Vegetarian',
  Vegan = 'Vegan',
  GlutenFree = 'GlutenFree',
  DairyFree = 'DairyFree',
  NutFree = 'NutFree',
  Halal = 'Halal',
  Kosher = 'Kosher'
}

// Utility interfaces
export interface MenuValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface MenuImportResult {
  successCount: number;
  errorCount: number;
  errors: {
    row: number;
    message: string;
  }[];
  importedItems: MenuItemDTO[];
}
