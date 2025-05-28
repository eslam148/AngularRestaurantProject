import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, UserRole, CustomerProfile, AdminProfile, DeliveryProfile } from '../models/user.model';
import { Restaurant, CuisineType, PriceRange } from '../models/restaurant.model';
import { MenuItem, MenuCategory } from '../models/menu.model';
import { Order, OrderStatus, PaymentMethodType } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Set a default customer user
    const defaultUser = this.getMockUsers().find(u => u.role === UserRole.CUSTOMER);
    if (defaultUser) {
      this.currentUser$.next(defaultUser);
    }
  }

  // User Management
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  setCurrentUser(user: User | null): void {
    this.currentUser$.next(user);
  }

  getMockUsers(): User[] {
    return [
      {
        id: '1',
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: UserRole.CUSTOMER,
        isActive: true,
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: '2',
        email: 'admin@example.com',
        firstName: 'Sarah',
        lastName: 'Wilson',
        phone: '+1 (555) 987-6543',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: UserRole.ADMIN,
        isActive: true,
        createdAt: new Date('2022-06-10'),
        updatedAt: new Date()
      },
      {
        id: '3',
        email: 'delivery@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+1 (555) 456-7890',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: UserRole.DELIVERY,
        isActive: true,
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date()
      },
      {
        id: '4',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: UserRole.CUSTOMER,
        isActive: true,
        createdAt: new Date('2023-02-28'),
        updatedAt: new Date()
      },
      {
        id: '5',
        email: 'alex.driver@example.com',
        firstName: 'Alex',
        lastName: 'Rodriguez',
        phone: '+1 (555) 345-6789',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: UserRole.DELIVERY,
        isActive: true,
        createdAt: new Date('2023-04-05'),
        updatedAt: new Date()
      }
    ];
  }

  // Admin Dashboard Data
  getAdminDashboardStats(): any[] {
    return [
      {
        title: 'Total Orders',
        value: '1,234',
        change: '+12%',
        icon: 'orders',
        trend: 'up',
        color: 'primary'
      },
      {
        title: 'Total Revenue',
        value: '$45,678',
        change: '+8%',
        icon: 'revenue',
        trend: 'up',
        color: 'success'
      },
      {
        title: 'Active Restaurants',
        value: '56',
        change: '+3%',
        icon: 'restaurants',
        trend: 'up',
        color: 'info'
      },
      {
        title: 'Delivery Drivers',
        value: '23',
        change: '+5%',
        icon: 'drivers',
        trend: 'up',
        color: 'warning'
      }
    ];
  }

  getAdminRecentOrders(): any[] {
    return [
      {
        id: '#12345',
        customer: 'John Doe',
        restaurant: 'Pizza Palace',
        amount: '$25.50',
        status: 'delivered',
        time: '2 hours ago'
      },
      {
        id: '#12346',
        customer: 'Jane Smith',
        restaurant: 'Burger Barn',
        amount: '$18.75',
        status: 'preparing',
        time: '30 minutes ago'
      },
      {
        id: '#12347',
        customer: 'Mike Johnson',
        restaurant: 'Sushi Zen',
        amount: '$42.00',
        status: 'out_for_delivery',
        time: '1 hour ago'
      },
      {
        id: '#12348',
        customer: 'Sarah Wilson',
        restaurant: 'Taco Fiesta',
        amount: '$16.25',
        status: 'confirmed',
        time: '15 minutes ago'
      }
    ];
  }

  getAdminRecentActivity(): any[] {
    return [
      {
        id: '1',
        type: 'order',
        message: 'New order #12348 received from Sarah Wilson',
        time: '5 minutes ago',
        icon: 'order'
      },
      {
        id: '2',
        type: 'restaurant',
        message: 'Pizza Palace updated their menu',
        time: '1 hour ago',
        icon: 'restaurant'
      },
      {
        id: '3',
        type: 'delivery',
        message: 'Driver Alex Rodriguez went online',
        time: '2 hours ago',
        icon: 'delivery'
      },
      {
        id: '4',
        type: 'user',
        message: 'New customer registration: Emma Davis',
        time: '3 hours ago',
        icon: 'user'
      }
    ];
  }

  // Delivery Dashboard Data
  getDeliveryDashboardStats(): any[] {
    return [
      {
        title: 'Today\'s Deliveries',
        value: '12',
        icon: 'deliveries',
        color: 'primary'
      },
      {
        title: 'Today\'s Earnings',
        value: '$156.50',
        icon: 'earnings',
        color: 'success'
      },
      {
        title: 'Distance Traveled',
        value: '45.2 km',
        icon: 'distance',
        color: 'info'
      },
      {
        title: 'Average Rating',
        value: '4.8',
        icon: 'rating',
        color: 'warning'
      }
    ];
  }

  getDeliveryPendingOrders(): any[] {
    return [
      {
        id: '#12345',
        restaurant: 'Pizza Palace',
        customer: 'John Doe',
        address: '123 Main St, Apt 4B',
        amount: '$25.50',
        distance: '2.1 km',
        estimatedTime: '15 min',
        priority: 'high'
      },
      {
        id: '#12346',
        restaurant: 'Burger Barn',
        customer: 'Jane Smith',
        address: '456 Oak Ave, Suite 200',
        amount: '$18.75',
        distance: '1.8 km',
        estimatedTime: '12 min',
        priority: 'medium'
      },
      {
        id: '#12347',
        restaurant: 'Sushi Zen',
        customer: 'Mike Johnson',
        address: '789 Pine St',
        amount: '$42.00',
        distance: '3.5 km',
        estimatedTime: '20 min',
        priority: 'low'
      }
    ];
  }

  getDeliveryEarningsData(): any {
    return {
      today: {
        total: 156.50,
        deliveries: 12,
        tips: 45.20,
        base: 111.30
      },
      week: {
        total: 892.75,
        deliveries: 67,
        tips: 234.50,
        base: 658.25
      },
      month: {
        total: 3567.25,
        deliveries: 245,
        tips: 892.15,
        base: 2675.10
      },
      dailyEarnings: [
        { day: 'Mon', amount: 125.50 },
        { day: 'Tue', amount: 143.75 },
        { day: 'Wed', amount: 98.25 },
        { day: 'Thu', amount: 167.50 },
        { day: 'Fri', amount: 201.25 },
        { day: 'Sat', amount: 156.50 },
        { day: 'Sun', amount: 0 }
      ]
    };
  }

  // Customer Data
  getCustomerFavoriteRestaurants(): Restaurant[] {
    const allRestaurants = this.getMockRestaurants();
    return allRestaurants.slice(0, 3); // Return first 3 as favorites
  }

  getCustomerRecentOrders(): Order[] {
    return this.getMockOrders().slice(0, 5); // Return 5 most recent orders
  }

  // Restaurant Data
  getMockRestaurants(): Restaurant[] {
    return [
      {
        id: '1',
        name: 'Pizza Palace',
        description: 'Authentic Italian pizza with fresh ingredients and traditional recipes',
        cuisine: [CuisineType.ITALIAN, CuisineType.PIZZA],
        coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
        rating: 4.5,
        reviewCount: 324,
        priceRange: PriceRange.MODERATE,
        deliveryTime: '25-35 min',
        deliveryFee: 2.99,
        minimumOrder: 15.00,
        isOpen: true,
        isFeatured: true,
        address: {
          street: '123 Pizza Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        contact: {
          phone: '+1 (555) 123-4567',
          email: 'info@pizzapalace.com',
          website: 'https://pizzapalace.com'
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
        deliveryZones: [
          {
            id: 'zone-1',
            name: 'Downtown',
            coordinates: [
              { latitude: 40.7128, longitude: -74.0060 },
              { latitude: 40.7589, longitude: -73.9851 }
            ],
            deliveryFee: 2.99,
            estimatedTime: '25-35 min'
          }
        ],
        tags: ['Popular', 'Fast Delivery', 'Family Friendly'],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Burger Barn',
        description: 'Gourmet burgers made with premium beef and fresh local ingredients',
        cuisine: [CuisineType.AMERICAN, CuisineType.FAST_FOOD],
        coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
        rating: 4.3,
        reviewCount: 256,
        priceRange: PriceRange.MODERATE,
        deliveryTime: '20-30 min',
        deliveryFee: 1.99,
        minimumOrder: 12.00,
        isOpen: true,
        isFeatured: false,
        address: {
          street: '456 Burger Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA',
          coordinates: { latitude: 40.7589, longitude: -73.9851 }
        },
        contact: {
          phone: '+1 (555) 987-6543',
          email: 'info@burgerbarn.com'
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
        deliveryZones: [
          {
            id: 'zone-2',
            name: 'Midtown',
            coordinates: [
              { latitude: 40.7589, longitude: -73.9851 },
              { latitude: 40.7831, longitude: -73.9712 }
            ],
            deliveryFee: 1.99,
            estimatedTime: '20-30 min'
          }
        ],
        tags: ['Premium Beef', 'Local Ingredients', 'Gourmet'],
        createdAt: new Date('2023-02-20'),
        updatedAt: new Date()
      }
    ];
  }

  // Order Data
  getMockOrders(): Order[] {
    return [
      {
        id: 'order-1',
        orderNumber: 'RA123456',
        customerId: '1',
        restaurantId: '1',
        status: OrderStatus.DELIVERED,
        items: [
          {
            id: 'item-1',
            menuItemId: 'item-1-2',
            name: 'Margherita Pizza',
            price: 14.99,
            quantity: 1,
            customizations: [],
            totalPrice: 14.99
          }
        ],
        subtotal: 14.99,
        tax: 1.20,
        deliveryFee: 2.99,
        total: 19.18,
        paymentMethod: { id: PaymentMethodType.CASH, name: 'Cash on Delivery' },
        deliveryAddress: {
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        estimatedDeliveryTime: new Date('2024-01-15T15:15:00'),
        actualDeliveryTime: new Date('2024-01-15T15:10:00'),
        createdAt: new Date('2024-01-15T14:30:00'),
        updatedAt: new Date('2024-01-15T15:10:00'),
        timeline: [
          {
            status: OrderStatus.PENDING,
            timestamp: new Date('2024-01-15T14:30:00'),
            message: 'Order placed'
          },
          {
            status: OrderStatus.DELIVERED,
            timestamp: new Date('2024-01-15T15:10:00'),
            message: 'Order delivered successfully'
          }
        ]
      },
      {
        id: 'order-2',
        orderNumber: 'RA123457',
        customerId: '1',
        restaurantId: '2',
        status: OrderStatus.OUT_FOR_DELIVERY,
        items: [
          {
            id: 'item-2',
            menuItemId: 'item-2-1',
            name: 'Classic Burger',
            price: 12.99,
            quantity: 2,
            customizations: [],
            totalPrice: 25.98
          }
        ],
        subtotal: 25.98,
        tax: 2.08,
        deliveryFee: 1.99,
        total: 30.05,
        paymentMethod: { id: PaymentMethodType.CREDIT_CARD, name: 'Credit Card' },
        deliveryAddress: {
          street: '123 Main Street, Apt 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        estimatedDeliveryTime: new Date('2024-01-16T13:00:00'),
        createdAt: new Date('2024-01-16T12:15:00'),
        updatedAt: new Date('2024-01-16T12:45:00'),
        timeline: [
          {
            status: OrderStatus.PENDING,
            timestamp: new Date('2024-01-16T12:15:00'),
            message: 'Order placed'
          },
          {
            status: OrderStatus.OUT_FOR_DELIVERY,
            timestamp: new Date('2024-01-16T12:45:00'),
            message: 'Order out for delivery'
          }
        ]
      }
    ];
  }

  // Auth Mock Data
  getAuthMockData(): any {
    return {
      loginCredentials: [
        { email: 'customer@example.com', password: 'password123', role: UserRole.CUSTOMER },
        { email: 'admin@example.com', password: 'admin123', role: UserRole.ADMIN },
        { email: 'delivery@example.com', password: 'delivery123', role: UserRole.DELIVERY }
      ],
      registrationData: {
        sampleCustomer: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          password: 'password123'
        }
      }
    };
  }

  // Analytics Data for Admin
  getAnalyticsData(): any {
    return {
      orderTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Orders',
            data: [120, 190, 300, 500, 200, 300],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
          }
        ]
      },
      revenueTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue ($)',
            data: [1200, 1900, 3000, 5000, 2000, 3000],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
          }
        ]
      },
      topRestaurants: [
        { name: 'Pizza Palace', orders: 234, revenue: 5678.90 },
        { name: 'Burger Barn', orders: 189, revenue: 4321.50 },
        { name: 'Sushi Zen', orders: 156, revenue: 6789.25 },
        { name: 'Taco Fiesta', orders: 143, revenue: 3456.75 }
      ],
      customerSegments: {
        new: 25,
        returning: 65,
        vip: 10
      }
    };
  }

  // Notification Data
  getNotifications(): any[] {
    return [
      {
        id: '1',
        type: 'order',
        title: 'New Order Received',
        message: 'Order #12348 from Sarah Wilson',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'delivery',
        title: 'Delivery Completed',
        message: 'Order #12345 delivered successfully',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'system',
        title: 'System Update',
        message: 'New features available in admin panel',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        priority: 'low'
      }
    ];
  }

  // Settings Data
  getSystemSettings(): any {
    return {
      general: {
        siteName: 'Restaurant App',
        siteDescription: 'Food delivery made easy',
        contactEmail: 'support@restaurantapp.com',
        contactPhone: '+1 (555) 123-4567',
        timezone: 'America/New_York',
        currency: 'USD',
        language: 'en'
      },
      delivery: {
        baseFee: 2.99,
        freeDeliveryThreshold: 25.00,
        maxDeliveryDistance: 10, // km
        estimatedDeliveryTime: 30 // minutes
      },
      payment: {
        acceptCash: true,
        acceptCard: true,
        acceptDigitalWallet: true,
        taxRate: 0.08 // 8%
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true
      }
    };
  }
}
