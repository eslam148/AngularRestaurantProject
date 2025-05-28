import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddressListComponent } from './components/address-list/address-list.component';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { NavigationTestComponent } from './components/navigation-test/navigation-test.component';


export const routes: Routes = [
  { path: '', redirectTo: '/navigation-test', pathMatch: 'full' },

  // Navigation Test Route
  { path: 'navigation-test', component: NavigationTestComponent },

  // Authentication Routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Customer Routes (no layout wrapper)
  { path: 'customer/menu', component: RestaurantListComponent },
  { path: 'customer/restaurants', component: RestaurantListComponent },
  { path: 'customer/restaurants/:id', component: RestaurantDetailComponent },
  { path: 'customer/cart', component: RestaurantListComponent }, // Placeholder
  { path: 'customer/orders', component: OrderListComponent, canActivate: [authGuard] },
  { path: 'customer/orders/:id', component: OrderDetailComponent, canActivate: [authGuard] },
  { path: 'customer/profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'customer/addresses', component: AddressListComponent, canActivate: [authGuard] },
  { path: 'customer/payments', component: PaymentListComponent, canActivate: [authGuard] },
  { path: 'customer', redirectTo: '/customer/menu', pathMatch: 'full' },

  // Admin Routes (no layout wrapper)
  { path: 'admin/dashboard', component: NavigationTestComponent }, // Placeholder
  { path: 'admin/restaurants', component: RestaurantListComponent },
  { path: 'admin/orders', component: OrderListComponent },
  { path: 'admin/analytics', component: NavigationTestComponent }, // Placeholder
  { path: 'admin/settings', component: NavigationTestComponent }, // Placeholder
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },

  // Delivery Routes (no layout wrapper)
  { path: 'delivery/dashboard', component: NavigationTestComponent }, // Placeholder
  { path: 'delivery/orders', component: OrderListComponent },
  { path: 'delivery/map', component: NavigationTestComponent }, // Placeholder
  { path: 'delivery/profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'delivery', redirectTo: '/delivery/dashboard', pathMatch: 'full' },

  // Legacy Routes (redirect to customer layout)
  { path: 'restaurants', redirectTo: '/customer/restaurants' },
  { path: 'restaurants/:id', redirectTo: '/customer/restaurants/:id' },
  { path: 'profile', redirectTo: '/customer/profile' },
  { path: 'orders', redirectTo: '/customer/orders' },
  { path: 'orders/:id', redirectTo: '/customer/orders/:id' },
  { path: 'addresses', redirectTo: '/customer/addresses' },
  { path: 'payments', redirectTo: '/customer/payments' },

  // Fallback
  { path: '**', redirectTo: '/navigation-test' }
];
