export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  restaurantId: string;
  deliveryPersonId?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress;
  specialInstructions?: string;
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  timeline: OrderTimeline[];
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations: OrderItemCustomization[];
  specialInstructions?: string;
  totalPrice: number;
}

export interface OrderItemCustomization {
  name: string;
  options: string[];
  additionalPrice: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  deliveryInstructions?: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: Date;
  message: string;
  updatedBy?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentMethodType {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  DIGITAL_WALLET = 'digital_wallet',
  BANK_TRANSFER = 'bank_transfer'
}

export interface PaymentMethod {
  id: PaymentMethodType;
  name: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  restaurantId?: string;
  customerId?: string;
  deliveryPersonId?: string;
  paymentMethod?: PaymentMethodType[];
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completionRate: number;
  averageDeliveryTime: number;
  topItems: Array<{
    itemName: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface DeliveryTracking {
  orderId: string;
  deliveryPersonId: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: Date;
  route: Array<{
    latitude: number;
    longitude: number;
  }>;
  lastUpdated: Date;
}
