export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: CuisineType[];
  coverImage: string;
  logo: string;
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  isOpen: boolean;
  isFeatured: boolean;
  address: RestaurantAddress;
  contact: RestaurantContact;
  operatingHours: OperatingHours;
  deliveryZones: DeliveryZone[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface RestaurantContact {
  phone: string;
  email: string;
  website?: string;
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  coordinates: Array<{latitude: number; longitude: number}>;
  deliveryFee: number;
  estimatedTime: string;
}

export enum CuisineType {
  ITALIAN = 'italian',
  CHINESE = 'chinese',
  INDIAN = 'indian',
  MEXICAN = 'mexican',
  AMERICAN = 'american',
  JAPANESE = 'japanese',
  THAI = 'thai',
  MEDITERRANEAN = 'mediterranean',
  FRENCH = 'french',
  GREEK = 'greek',
  KOREAN = 'korean',
  VIETNAMESE = 'vietnamese',
  MIDDLE_EASTERN = 'middle_eastern',
  FAST_FOOD = 'fast_food',
  PIZZA = 'pizza',
  SEAFOOD = 'seafood',
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  DESSERTS = 'desserts',
  COFFEE = 'coffee'
}

export enum PriceRange {
  BUDGET = '$',
  MODERATE = '$$',
  EXPENSIVE = '$$$',
  LUXURY = '$$$$'
}

export interface RestaurantFilters {
  cuisine?: CuisineType[];
  priceRange?: PriceRange[];
  rating?: number;
  deliveryTime?: number;
  distance?: number;
  isOpen?: boolean;
  searchQuery?: string;
}

export interface RestaurantStats {
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  popularItems: string[];
  peakHours: string[];
}
