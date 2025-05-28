export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  restaurantId: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  restaurantId: string;
  isAvailable: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  allergens: Allergen[];
  nutritionInfo?: NutritionInfo;
  customizations: MenuItemCustomization[];
  preparationTime: number;
  calories?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemCustomization {
  id: string;
  name: string;
  type: CustomizationType;
  isRequired: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export enum CustomizationType {
  SINGLE_SELECT = 'single_select',
  MULTI_SELECT = 'multi_select',
  TEXT_INPUT = 'text_input'
}

export enum Allergen {
  NUTS = 'nuts',
  DAIRY = 'dairy',
  EGGS = 'eggs',
  SOY = 'soy',
  WHEAT = 'wheat',
  FISH = 'fish',
  SHELLFISH = 'shellfish',
  SESAME = 'sesame'
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: SelectedCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
  textValue?: string;
}

export interface Cart {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuFilters {
  categoryId?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  priceRange?: {min: number; max: number};
  searchQuery?: string;
  allergens?: Allergen[];
}
