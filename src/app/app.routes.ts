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

export const routes: Routes = [
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'restaurants', component: RestaurantListComponent },
  { path: 'restaurants/:id', component: RestaurantDetailComponent },  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: OrderListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders/:id',
    component: OrderDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'addresses',
    component: AddressListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'payments',
    component: PaymentListComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/restaurants' }
];
