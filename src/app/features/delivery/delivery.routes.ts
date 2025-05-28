import { Routes } from '@angular/router';
import { DeliveryLayoutComponent } from '../../layout/delivery-layout/delivery-layout.component';

export const deliveryRoutes: Routes = [
  {
    path: '',
    component: DeliveryLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.component').then(m => m.MapComponent)
      },
      {
        path: 'earnings',
        loadComponent: () => import('./pages/earnings/earnings.component').then(m => m.EarningsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];
