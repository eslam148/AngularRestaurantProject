import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route - redirect to customer
  {
    path: '',
    redirectTo: '/customer',
    pathMatch: 'full'
  },

  // Customer Module (Public + Authenticated)
  {
    path: 'customer',
    loadChildren: () => import('./features/customer/customer.routes').then(m => m.customerRoutes)
  },

  // Admin Module (Restaurant Owners & Administrators)
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },

  // Delivery Module (Delivery Drivers)
  {
    path: 'delivery',
    loadChildren: () => import('./features/delivery/delivery.routes').then(m => m.deliveryRoutes)
  },

  // Authentication Routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },

  // Profile Routes
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
  },

  // Wildcard route - 404 page
  {
    path: '**',
    redirectTo: '/customer'
  }
];
