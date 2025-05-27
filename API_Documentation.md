# Restaurant API Documentation for Angular Integration

## Base URL
```
https://restaurants.runasp.net/api
```

## Authentication

### Authentication Endpoints

#### 1. Register
- **Endpoint**: `POST /Account/register`
- **Description**: Register a new user
- **Request Body**:
```typescript
interface RegisterDTO {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    role: string;
}
```
- **Response**: `Response<boolean>`

#### 2. Login
- **Endpoint**: `POST /Account/login`
- **Description**: Authenticate user and get access token
- **Request Body**:
```typescript
interface LoginDTO {
    email: string;
    password: string;
}
```
- **Response**:
```typescript
interface LoginResponseDTO {
    token: string;
    refreshToken: string;
    // Additional user information
}
```

#### 3. Refresh Token
- **Endpoint**: `POST /Account/refresh-token`
- **Description**: Get a new access token using refresh token
- **Authentication**: Required
- **Request Body**:
```typescript
interface RefreshTokenDto {
    token: string;
    refreshToken: string;
}
```
- **Response**: `Response<string>`

#### 4. Email Confirmation
- **Endpoint**: `POST /Account/Confirm-Email-otp`
- **Description**: Confirm email using OTP
- **Request Parameters**:
  - `userId: string`
  - `otp: number`
- **Response**: `Response<boolean>`

## Customer Management

### Customer Endpoints

#### 1. Get Current Profile
- **Endpoint**: `GET /Customer/CurrentProfile`
- **Description**: Get the profile of the currently logged-in customer
- **Authentication**: Required
- **Response**: `Response<CustomerProfileDTO>`

#### 2. Get Customer Details
- **Endpoint**: `GET /Customer/Details/{id}`
- **Description**: Get details of a specific customer
- **Authentication**: Required
- **Parameters**: `id: number`
- **Response**: `Response<CustomerDTO>`

#### 3. Update Profile
- **Endpoint**: `PUT /Customer/UpdateProfile`
- **Description**: Update customer profile
- **Authentication**: Required
- **Request Body**: `CustomerUpdateDTO`
- **Response**: `Response<boolean>`

#### 4. Delete Profile
- **Endpoint**: `DELETE /Customer/DeleteProfile`
- **Description**: Delete customer profile
- **Authentication**: Required
- **Response**: `Response<boolean>`

## Admin Management

### Admin Endpoints

#### 1. Add Role to User
- **Endpoint**: `POST /Admin/AddRoleToUser`
- **Description**: Assign a role to a user (Admin only)
- **Authentication**: Required (Admin)
- **Request Body**: `AdminDTO`
- **Response**: `Response<AdminResponseDTO>`

#### 2. Get All Users with Roles
- **Endpoint**: `GET /Admin/GetAllUsersWithRolesAsync`
- **Description**: Get all users and their roles (Admin only)
- **Authentication**: Required (Admin)
- **Response**: `UserWithRoleDTO[]`

## Restaurant Management

### Restaurant Endpoints

#### 1. Get All Restaurants
- **Endpoint**: `GET /Restaurant`
- **Description**: Get a list of all restaurants
- **Authentication**: No authentication required
- **Response**: `Response<List<RestaurantDTO>>`

#### 2. Get Restaurant by ID
- **Endpoint**: `GET /Restaurant/{id}`
- **Description**: Get details of a specific restaurant
- **Parameters**: `id: number`
- **Response**: `Response<RestaurantDTO>`

## Order Management

### Order Endpoints (Customer)

#### 1. Place Order
- **Endpoint**: `POST /Customer/AddOrder`
- **Description**: Place a new order
- **Authentication**: Required
- **Request Body**: `OrderDTO`
- **Response**: `Response<OrderDTO>`

#### 2. Get All Orders
- **Endpoint**: `GET /Customer/GetAllOrders`
- **Description**: Get all orders for the current customer
- **Authentication**: Required
- **Response**: `Response<List<OrderDTO>>`

### Order Endpoints (Delivery)

#### 1. Get All Deliveries
- **Endpoint**: `GET /Delivery/GetAllDeliveries`
- **Description**: Get all orders available for delivery
- **Response**: `Response<IEnumerable<OrderForDeliveryDto>>`

#### 2. Get Order Details
- **Endpoint**: `GET /Delivery/GetOrderDetailsForDelivery`
- **Description**: Get detailed information about a specific order
- **Parameters**: `id: number`
- **Response**: `OrderDetailsDto`

#### 3. Update Order Status
- **Endpoint**: `PUT /Delivery/UpdateOrderStatusFromPindingtoOntheWay`
- **Description**: Update order status from Pending to On the Way
- **Parameters**: `id: number`
- **Response**: `DeliveryStatusDto`

- **Endpoint**: `PUT /Delivery/UpdateOrderStatusFromPindingtoDevlived`
- **Description**: Update order status from On the Way to Delivered
- **Parameters**: `id: number`
- **Response**: `DeliveryStatusDto`

- **Endpoint**: `PUT /Delivery/UpdateOrderStatusFromPindingtoCancelled`
- **Description**: Update order status to Cancelled
- **Parameters**: `id: number`
- **Response**: `DeliveryStatusDto`

#### 4. Filter Orders
- **Endpoint**: `POST /Delivery/filter-by-status`
- **Description**: Get orders filtered by status
- **Request Body**:
```typescript
interface OrderStatusFilterDto {
    orderStatus: OrderStatus;
}
```
- **Response**: `Response<IEnumerable<OrderStatusFilterDto>>`

#### 5. Get Orders by Delivery
- **Endpoint**: `POST /Delivery/by-delivery`
- **Description**: Get all orders assigned to a specific delivery person
- **Parameters**: `deliveryId: number`
- **Response**: `Response<IEnumerable<OrdersByDeliveryDt>>`

## Address Management

### Address Endpoints

#### 1. Add Address
- **Endpoint**: `POST /Customer/AddAddresses`
- **Description**: Add a new address for the customer
- **Authentication**: Required
- **Request Body**: `AddressDTO`
- **Response**: `Response<AddressDTO>`

#### 2. Get All Addresses
- **Endpoint**: `GET /Customer/GetAllAddresses`
- **Description**: Get all addresses for the current customer
- **Authentication**: Required
- **Response**: `Response<List<AddressDTO>>`

## Payment Management

### Payment Endpoints

#### 1. Add Payment
- **Endpoint**: `POST /Customer/AddPayment`
- **Description**: Add a new payment
- **Authentication**: Required
- **Request Body**: `PaymentDTO`
- **Response**: `Response<PaymentDTO>`

#### 2. Get All Payments
- **Endpoint**: `GET /Customer/GetAllPayments`
- **Description**: Get all payments for the current customer
- **Authentication**: Required
- **Response**: `Response<List<PaymentDTO>>`

## Reports

### Report Endpoints

#### 1. Restaurant Reports
- **Endpoint**: `GET /Report/AllResturant`
- **Description**: Get all restaurants report
- **Response**: `Response<IEnumerable<AllResturantDto>>`

- **Endpoint**: `GET /Report/GetRestaurantCounter`
- **Description**: Get total number of restaurants
- **Response**: `Response<number>`

- **Endpoint**: `GET /Report/GetPaginatedForRestaurant`
- **Description**: Get paginated list of restaurants
- **Parameters**:
  - `pageNumber: number` (default: 1)
  - `pageSize: number` (default: 10)
- **Response**: `Response<PagedResult<AllResturantDto>>`

#### 2. Delivery Reports
- **Endpoint**: `GET /Report/GetAllDelivery`
- **Description**: Get all delivery orders report
- **Response**: `Response<IEnumerable<AllDeliveryOrder>>`

- **Endpoint**: `GET /Report/GetDeliveryCounter`
- **Description**: Get total number of delivery personnel
- **Response**: `Response<number>`

- **Endpoint**: `GET /Report/GetDeliveryOrdersCount/{deliveryID}`
- **Description**: Get order count for specific delivery person
- **Parameters**:
  - `deliveryID: number`
  - `dateOnly: string` (optional)
- **Response**: `Response<number>`

## Response Types

### Generic Response Structure
```typescript
interface Response<T> {
    data: T;
    status: ResponseStatus;
    message: string;
    internalMessage?: string;
}

enum ResponseStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    BadRequest = 'BadRequest',
    // ... other status types
}
```

## Angular Integration Guide

### 1. Setting Up HTTP Interceptor

Create an interceptor to handle authentication:

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
```

### 2. Authentication Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'your-api-base-url/api/Account';

  constructor(private http: HttpClient) {}

  login(credentials: LoginDTO): Observable<Response<LoginResponseDTO>> {
    return this.http.post<Response<LoginResponseDTO>>(`${this.apiUrl}/login`, credentials);
  }

  register(userData: RegisterDTO): Observable<Response<boolean>> {
    return this.http.post<Response<boolean>>(`${this.apiUrl}/register`, userData);
  }

  refreshToken(tokenData: RefreshTokenDto): Observable<Response<string>> {
    return this.http.post<Response<string>>(`${this.apiUrl}/refresh-token`, tokenData);
  }
}
```

### 3. Error Handling

Create a global error handling service:

```typescript
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error.message || error.message;
    }
    
    // Handle different response statuses
    switch (error.status) {
      case 401:
        // Handle unauthorized
        break;
      case 403:
        // Handle forbidden
        break;
      // ... handle other status codes
    }
    
    return throwError(() => errorMessage);
  }
}
```

### 4. Environment Configuration

Create environment files for different deployment environments:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:your-port/api',
  // ... other configuration
};

// environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-production-api/api',
  // ... other configuration
};
```

## Best Practices

1. **Token Management**:
   - Store tokens securely (preferably in memory for SPA)
   - Implement automatic token refresh mechanism
   - Clear tokens on logout

2. **Error Handling**:
   - Implement global error handling
   - Handle specific API error responses
   - Show appropriate user feedback

3. **Type Safety**:
   - Use TypeScript interfaces for all API requests and responses
   - Implement proper type checking

4. **Security**:
   - Never store sensitive information in localStorage
   - Implement CSRF protection if necessary
   - Use HTTPS for all API calls

5. **Performance**:
   - Implement request caching where appropriate
   - Use loading indicators for API calls
   - Implement retry logic for failed requests

### 5. Restaurant Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'your-api-base-url/api/Restaurant';

  constructor(private http: HttpClient) {}

  getAllRestaurants(): Observable<Response<RestaurantDTO[]>> {
    return this.http.get<Response<RestaurantDTO[]>>(this.apiUrl);
  }

  getRestaurantById(id: number): Observable<Response<RestaurantDTO>> {
    return this.http.get<Response<RestaurantDTO>>(`${this.apiUrl}/${id}`);
  }
}
```

### 6. Order Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'your-api-base-url/api/Customer';
  private deliveryUrl = 'your-api-base-url/api/Delivery';

  constructor(private http: HttpClient) {}

  // Customer Order Methods
  placeOrder(order: OrderDTO): Observable<Response<OrderDTO>> {
    return this.http.post<Response<OrderDTO>>(`${this.apiUrl}/AddOrder`, order);
  }

  getCustomerOrders(): Observable<Response<OrderDTO[]>> {
    return this.http.get<Response<OrderDTO[]>>(`${this.apiUrl}/GetAllOrders`);
  }

  // Delivery Order Methods
  getAllDeliveries(): Observable<Response<OrderForDeliveryDto[]>> {
    return this.http.get<Response<OrderForDeliveryDto[]>>(`${this.deliveryUrl}/GetAllDeliveries`);
  }

  getOrderDetails(id: number): Observable<Response<OrderDetailsDto>> {
    return this.http.get<Response<OrderDetailsDto>>(`${this.deliveryUrl}/GetOrderDetailsForDelivery/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<Response<DeliveryStatusDto>> {
    const endpoint = this.getStatusUpdateEndpoint(status);
    return this.http.put<Response<DeliveryStatusDto>>(`${this.deliveryUrl}/${endpoint}/${id}`, {});
  }

  private getStatusUpdateEndpoint(status: string): string {
    switch (status) {
      case 'OnTheWay':
        return 'UpdateOrderStatusFromPindingtoOntheWay';
      case 'Delivered':
        return 'UpdateOrderStatusFromPindingtoDevlived';
      case 'Cancelled':
        return 'UpdateOrderStatusFromPindingtoCancelled';
      default:
        throw new Error('Invalid status');
    }
  }
}
```

### 7. Address Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = 'your-api-base-url/api/Customer';

  constructor(private http: HttpClient) {}

  addAddress(address: AddressDTO): Observable<Response<AddressDTO>> {
    return this.http.post<Response<AddressDTO>>(`${this.apiUrl}/AddAddresses`, address);
  }

  getAllAddresses(): Observable<Response<AddressDTO[]>> {
    return this.http.get<Response<AddressDTO[]>>(`${this.apiUrl}/GetAllAddresses`);
  }
}
```

### 8. Report Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = 'your-api-base-url/api/Report';

  constructor(private http: HttpClient) {}

  getAllRestaurants(): Observable<Response<AllResturantDto[]>> {
    return this.http.get<Response<AllResturantDto[]>>(`${this.apiUrl}/AllResturant`);
  }

  getRestaurantCounter(): Observable<Response<number>> {
    return this.http.get<Response<number>>(`${this.apiUrl}/GetRestaurantCounter`);
  }

  getPaginatedRestaurants(pageNumber: number = 1, pageSize: number = 10): Observable<Response<PagedResult<AllResturantDto>>> {
    return this.http.get<Response<PagedResult<AllResturantDto>>>(`${this.apiUrl}/GetPaginatedForRestaurant`, {
      params: { pageNumber: pageNumber.toString(), pageSize: pageSize.toString() }
    });
  }

  getAllDeliveries(): Observable<Response<AllDeliveryOrder[]>> {
    return this.http.get<Response<AllDeliveryOrder[]>>(`${this.apiUrl}/GetAllDelivery`);
  }
}
```

### 9. Payment Service Example

```typescript
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'your-api-base-url/api/Customer';

  constructor(private http: HttpClient) {}

  addPayment(payment: PaymentDTO): Observable<Response<PaymentDTO>> {
    return this.http.post<Response<PaymentDTO>>(`${this.apiUrl}/AddPayment`, payment);
  }

  getAllPayments(): Observable<Response<PaymentDTO[]>> {
    return this.http.get<Response<PaymentDTO[]>>(`${this.apiUrl}/GetAllPayments`);
  }
}
```

## Angular Application Architecture

### Project Structure
```
src/
├── app/
│   ├── core/                   # Singleton services, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   ├── restaurant/
│   │   ├── orders/
│   │   └── profile/
│   ├── shared/               # Shared components, pipes, directives
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   └── store/                # NGRX store
│       ├── actions/
│       ├── effects/
│       ├── reducers/
│       └── selectors/
└── assets/
    └── i18n/                # Translation files
```

### Guards Implementation

```typescript
// core/guards/auth.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}

// core/guards/role.guard.ts
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    if (this.authService.hasRole(requiredRole)) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
```

### Route Configuration with Guards

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: 'restaurant',
    loadChildren: () => import('./features/restaurant/restaurant.module').then(m => m.RestaurantModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  }
];
```

### Translation Implementation

1. Install dependencies:
```json
{
  "dependencies": {
    "@ngx-translate/core": "^latest",
    "@ngx-translate/http-loader": "^latest"
  }
}
```

2. Translation setup:
```typescript
// app.module.ts
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ]
})
export class AppModule { }
```

3. Translation files:
```json
// assets/i18n/en.json
{
  "AUTH": {
    "LOGIN": "Login",
    "REGISTER": "Register",
    "EMAIL": "Email",
    "PASSWORD": "Password"
  },
  "RESTAURANT": {
    "MENU": "Menu",
    "ORDER": "Order",
    "DELIVERY": "Delivery"
  }
}
```

4. Using translations:
```typescript
// In components
constructor(private translate: TranslateService) {
  translate.setDefaultLang('en');
}

// In templates
<h1>{{ 'AUTH.LOGIN' | translate }}</h1>
```

### State Management with NGRX

1. Install NGRX:
```json
{
  "dependencies": {
    "@ngrx/store": "^latest",
    "@ngrx/effects": "^latest",
    "@ngrx/entity": "^latest",
    "@ngrx/store-devtools": "^latest"
  }
}
```

2. State Interface:
```typescript
// store/state/app.state.ts
export interface AppState {
  auth: AuthState;
  restaurants: RestaurantState;
  orders: OrderState;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
```

3. Actions:
```typescript
// store/actions/auth.actions.ts
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginDTO }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);
```

4. Reducers:
```typescript
// store/reducers/auth.reducer.ts
export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
```

5. Effects:
```typescript
// store/effects/auth.effects.ts
@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map(response => AuthActions.loginSuccess({ user: response.data })),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
```

6. Selectors:
```typescript
// store/selectors/auth.selectors.ts
export const selectAuthState = (state: AppState) => state.auth;

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!user
);
```

7. Usage in Components:
```typescript
@Component({
  selector: 'app-login',
  template: `
    <div *ngIf="loading$ | async">Loading...</div>
    <div *ngIf="error$ | async as error">{{ error }}</div>
  `
})
export class LoginComponent {
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(private store: Store) {}

  login(credentials: LoginDTO) {
    this.store.dispatch(AuthActions.login({ credentials }));
  }
}
```

## Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "@angular/common": "^latest",
    "@angular/core": "^latest",
    "@auth0/angular-jwt": "^latest",
    "@ngx-translate/core": "^latest",
    "@ngx-translate/http-loader": "^latest",
    "@ngrx/store": "^latest",
    "@ngrx/effects": "^latest",
    "@ngrx/entity": "^latest",
    "@ngrx/store-devtools": "^latest",
    "rxjs": "^latest"
  }
}
```
