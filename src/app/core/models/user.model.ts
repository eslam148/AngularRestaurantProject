export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  DELIVERY = 'delivery'
}

export interface CustomerProfile extends User {
  addresses: Address[];
  favoriteRestaurants: string[];
  orderHistory: string[];
  preferences: CustomerPreferences;
}

export interface AdminProfile extends User {
  permissions: AdminPermission[];
  lastLogin: Date;
}

export interface DeliveryProfile extends User {
  vehicleType: VehicleType;
  licenseNumber: string;
  isOnline: boolean;
  currentLocation?: Location;
  deliveryZones: string[];
  rating: number;
  totalDeliveries: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: Location;
  isDefault: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface CustomerPreferences {
  language: string;
  theme: string;
  notifications: NotificationSettings;
  dietary: DietaryPreference[];
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

export enum DietaryPreference {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  GLUTEN_FREE = 'gluten_free',
  HALAL = 'halal',
  KOSHER = 'kosher',
  DAIRY_FREE = 'dairy_free',
  NUT_FREE = 'nut_free'
}

export enum AdminPermission {
  MANAGE_RESTAURANTS = 'manage_restaurants',
  MANAGE_USERS = 'manage_users',
  MANAGE_ORDERS = 'manage_orders',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SYSTEM = 'manage_system'
}

export enum VehicleType {
  BICYCLE = 'bicycle',
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  WALKING = 'walking'
}
