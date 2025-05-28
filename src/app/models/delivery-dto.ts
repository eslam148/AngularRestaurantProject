// Delivery-related DTOs matching the backend API

export interface OrderForDeliveryDto {
  orderId: number;
  customerName: string;
  address: string;
  status: OrderStatus;
  deliveryName?: string;
  estimatedDeliveryTime?: Date;
  totalAmount?: number;
  restaurantName?: string;
  customerPhone?: string;
  orderDate?: Date;
  priority?: OrderPriority;
  distance?: number;
}

export interface OrderDetailsDto {
  orderId: number;
  status: OrderStatus;
  type: string;
  customerName: string;
  deliveryName: string;
  address: string;
  restaurantName: string;
  items: OrderItemDto[];
  totalPrice: number;
  customerPhone?: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: Date;
  orderDate: Date;
  paymentMethod?: string;
}

export interface OrderItemDto {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  specialRequests?: string;
}

export interface DeliveryStatsDto {
  todayDeliveries: number;
  pendingOrders: number;
  completedToday: number;
  earnings: number;
  rating: number;
  totalDistance: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
}

export interface DeliveryPersonnelDto {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  currentLocation?: LocationDto;
  vehicleType?: string;
  rating: number;
  totalDeliveries: number;
  joinDate: Date;
}

export interface LocationDto {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
}

export interface DeliveryUpdateDto {
  orderId: number;
  status: OrderStatus;
  location?: LocationDto;
  estimatedArrival?: Date;
  notes?: string;
}

export interface EarningsDto {
  dailyEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  totalEarnings: number;
  deliveryFees: number;
  tips: number;
  bonuses: number;
  deductions: number;
}

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  isRead: boolean;
  orderId?: number;
  actionRequired?: boolean;
}

export enum OrderStatus {
  Pending = 'Pending',
  Preparing = 'Preparing',
  ReadyForPickup = 'ReadyForPickup',
  PickedUp = 'PickedUp',
  OnTheWay = 'OnTheWay',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export enum OrderPriority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High',
  Urgent = 'Urgent'
}

export enum NotificationType {
  NewOrder = 'NewOrder',
  OrderUpdate = 'OrderUpdate',
  DeliveryAssignment = 'DeliveryAssignment',
  PaymentReceived = 'PaymentReceived',
  SystemAlert = 'SystemAlert',
  Emergency = 'Emergency'
}

export interface OrderStatusFilterDto {
  orderStatus: OrderStatus;
  deliveryId?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DeliveryRouteDto {
  orderId: number;
  pickupLocation: LocationDto;
  deliveryLocation: LocationDto;
  estimatedDistance: number;
  estimatedDuration: number;
  optimizedRoute?: LocationDto[];
  trafficConditions?: string;
}
