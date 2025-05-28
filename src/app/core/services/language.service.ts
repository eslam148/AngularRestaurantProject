import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'restaurant-app-language';
  private languageSignal = signal<Language>('en');
  private directionSignal = computed<Direction>(() =>
    this.languageSignal() === 'ar' ? 'rtl' : 'ltr'
  );

  private translations: Record<Language, Record<string, any>> = {
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.restaurants': 'Restaurants',
      'nav.orders': 'Orders',
      'nav.profile': 'Profile',
      'nav.admin': 'Admin',
      'nav.delivery': 'Delivery',
      'nav.logout': 'Logout',
      'nav.login': 'Login',
      'nav.signup': 'Sign Up',

      // Common
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.add': 'Add',
      'common.view': 'View',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',

      // Restaurant
      'restaurant.rating': 'Rating',
      'restaurant.deliveryTime': 'Delivery Time',
      'restaurant.deliveryFee': 'Delivery Fee',
      'restaurant.minimumOrder': 'Minimum Order',
      'restaurant.cuisine': 'Cuisine',
      'restaurant.priceRange': 'Price Range',
      'restaurant.openNow': 'Open Now',
      'restaurant.closed': 'Closed',

      // Menu
      'menu.addToCart': 'Add to Cart',
      'menu.customizations': 'Customizations',
      'menu.specialInstructions': 'Special Instructions',
      'menu.vegetarian': 'Vegetarian',
      'menu.vegan': 'Vegan',
      'menu.glutenFree': 'Gluten Free',
      'menu.spicy': 'Spicy',
      'menu.popular': 'Popular',

      // Cart
      'cart.title': 'Your Cart',
      'cart.empty': 'Your cart is empty',
      'cart.subtotal': 'Subtotal',
      'cart.tax': 'Tax',
      'cart.deliveryFee': 'Delivery Fee',
      'cart.total': 'Total',
      'cart.checkout': 'Checkout',
      'cart.quantity': 'Quantity',

      // Order
      'order.status': 'Order Status',
      'order.pending': 'Pending',
      'order.confirmed': 'Confirmed',
      'order.preparing': 'Preparing',
      'order.readyForPickup': 'Ready for Pickup',
      'order.outForDelivery': 'Out for Delivery',
      'order.delivered': 'Delivered',
      'order.cancelled': 'Cancelled',
      'order.trackOrder': 'Track Order',
      'order.refunded': 'Refunded',
      'order.title': 'Order',
      'order.placedOn': 'Placed on',
      'order.loading': 'Loading order details...',
      'order.notFound.title': 'Order Not Found',
      'order.notFound.message': 'The order you are looking for does not exist or has been removed.',
      'order.notFound.backToOrders': 'Back to Orders',
      'order.cancelConfirm': 'Are you sure you want to cancel this order?',

      // Order Tracking
      'order.tracking.title': 'Order Tracking',
      'order.tracking.estimatedDelivery': 'Estimated delivery',
      'order.tracking.steps': 'steps',

      // Order Timeline
      'order.timeline.title': 'Order Timeline',
      'order.timeline.updatedBy': 'Updated by',

      // Order Items
      'order.items.title': 'Order Items',
      'order.items.quantity': 'Qty',
      'order.items.each': 'each',

      // Order Actions
      'order.actions.title': 'Order Actions',
      'order.actions.cancel': 'Cancel Order',
      'order.actions.cancelling': 'Cancelling...',
      'order.actions.reorder': 'Reorder',
      'order.actions.reordering': 'Reordering...',
      'order.actions.viewRestaurant': 'View Restaurant',

      // Order Summary
      'order.summary.title': 'Order Summary',
      'order.summary.subtotal': 'Subtotal',
      'order.summary.tax': 'Tax',
      'order.summary.deliveryFee': 'Delivery Fee',
      'order.summary.free': 'Free',
      'order.summary.total': 'Total',

      // Order Delivery
      'order.delivery.title': 'Delivery Information',
      'order.delivery.address': 'Delivery Address',
      'order.delivery.instructions': 'Delivery Instructions',
      'order.delivery.paymentMethod': 'Payment Method',

      // Orders List
      'orders.title': 'Your Orders',
      'orders.subtitle': 'Track and manage your food orders',
      'orders.loading': 'Loading your orders...',
      'orders.empty.title': 'No Orders Found',
      'orders.empty.filtered': 'No orders match your current filters.',
      'orders.empty.noOrders': 'You haven\'t placed any orders yet.',
      'orders.empty.browseRestaurants': 'Browse Restaurants',
      'orders.orderNumber': 'Order',
      'orders.item': 'item',
      'orders.items': 'items',
      'orders.andMore': 'and',
      'orders.more': 'more',
      'orders.total': 'Total',
      'orders.actions.track': 'Track',
      'orders.actions.reorder': 'Reorder',
      'orders.actions.cancel': 'Cancel',
      'orders.search.placeholder': 'Search orders...',
      'orders.filter.allStatuses': 'All Statuses',
      'orders.sort.date': 'Sort by Date',
      'orders.sort.status': 'Sort by Status',
      'orders.sort.total': 'Sort by Total',
      'orders.sort.newest': 'Newest First',
      'orders.sort.oldest': 'Oldest First',

      // Pagination
      'pagination.previous': 'Previous',
      'pagination.next': 'Next',
      'pagination.showing': 'Showing',
      'pagination.of': 'of',
      'pagination.results': 'results',

      // Checkout
      'checkout.title': 'Checkout',
      'checkout.orderSummary': 'Order Summary',
      'checkout.estimatedDelivery': 'Estimated delivery',
      'checkout.placeOrder': 'Place Order',
      'checkout.placingOrder': 'Placing Order...',
      'checkout.confirmation.title': 'Order Placed Successfully!',
      'checkout.confirmation.message': 'Thank you for your order. You will receive a confirmation email shortly.',

      // Checkout Address
      'checkout.address.title': 'Delivery Address',
      'checkout.address.saved': 'Saved Addresses',
      'checkout.address.useCustom': 'Use a different address',
      'checkout.address.street': 'Street Address',
      'checkout.address.streetPlaceholder': 'Enter your street address',
      'checkout.address.city': 'City',
      'checkout.address.cityPlaceholder': 'Enter city',
      'checkout.address.state': 'State',
      'checkout.address.statePlaceholder': 'State',
      'checkout.address.zipCode': 'ZIP Code',
      'checkout.address.zipPlaceholder': 'ZIP',
      'checkout.address.instructions': 'Delivery Instructions',
      'checkout.address.instructionsPlaceholder': 'e.g., Ring doorbell, Leave at door, etc.',

      // Checkout Payment
      'checkout.payment.title': 'Payment Method',

      // Checkout Review
      'checkout.review.title': 'Review Your Order',
      'checkout.review.delivery': 'Delivery Details',
      'checkout.review.payment': 'Payment Method',
      'checkout.review.items': 'Order Items',
      'checkout.review.estimatedTime': 'Estimated Delivery',

      // Theme
      'theme.light': 'Light Mode',
      'theme.dark': 'Dark Mode',
      'theme.auto': 'Auto Mode',
      'theme.toggle': 'Toggle Theme',

      // Language
      'language.english': 'English',
      'language.arabic': 'العربية',
      'language.toggle': 'Toggle Language',

      // App
      'app.title': 'RestaurantApp - Food Delivery',
      'app.name': 'RestaurantApp',

      // Navigation
      'nav.toggleNavigation': 'Toggle navigation',
      'nav.dashboard': 'Dashboard',

      // Landing Page
      'landing.hero.title': 'Delicious Food Delivered Fast',
      'landing.hero.subtitle': 'Order from your favorite restaurants and get fresh food delivered to your door in minutes.',
      'landing.hero.browseRestaurants': 'Browse Restaurants',
      'landing.hero.signUp': 'Sign Up',
      'landing.offers.title': 'Special Offers',
      'landing.offers.subtitle': 'Don\'t miss out on these amazing deals!',
      'landing.featured.title': 'Featured Restaurants',
      'landing.featured.subtitle': 'Popular choices in your area',
      'landing.featured.viewAll': 'View All Restaurants',
      'landing.howItWorks.title': 'How It Works',
      'landing.howItWorks.step1.title': 'Browse',
      'landing.howItWorks.step1.description': 'Choose from hundreds of restaurants',
      'landing.howItWorks.step2.title': 'Order',
      'landing.howItWorks.step2.description': 'Add items to cart and checkout',
      'landing.howItWorks.step3.title': 'Enjoy',
      'landing.howItWorks.step3.description': 'Get fresh food delivered to your door',

      // Offers (for landing page)
      'offers.freeDelivery.title': 'Free Delivery',
      'offers.freeDelivery.description': 'On orders over $25',
      'offers.discount.title': '20% Off',
      'offers.discount.description': 'First order discount',

      // Cart
      'cart.itemsInCart': 'items in cart',
      'cart.minimumOrder': 'Add {{amount}} more for minimum order',

      // Menu Customization
      'menu.customization.textPlaceholder': 'Enter your preference...',
    },
    ar: {
      // Navigation
      'nav.home': 'الرئيسية',
      'nav.restaurants': 'المطاعم',
      'nav.orders': 'الطلبات',
      'nav.profile': 'الملف الشخصي',
      'nav.admin': 'الإدارة',
      'nav.delivery': 'التوصيل',
      'nav.logout': 'تسجيل الخروج',
      'nav.login': 'تسجيل الدخول',
      'nav.signup': 'إنشاء حساب',

      // Common
      'common.search': 'بحث',
      'common.filter': 'تصفية',
      'common.sort': 'ترتيب',
      'common.loading': 'جاري التحميل...',
      'common.error': 'خطأ',
      'common.success': 'نجح',
      'common.cancel': 'إلغاء',
      'common.confirm': 'تأكيد',
      'common.save': 'حفظ',
      'common.edit': 'تعديل',
      'common.delete': 'حذف',
      'common.add': 'إضافة',
      'common.view': 'عرض',
      'common.back': 'رجوع',
      'common.next': 'التالي',
      'common.previous': 'السابق',

      // Restaurant
      'restaurant.rating': 'التقييم',
      'restaurant.deliveryTime': 'وقت التوصيل',
      'restaurant.deliveryFee': 'رسوم التوصيل',
      'restaurant.minimumOrder': 'الحد الأدنى للطلب',
      'restaurant.cuisine': 'نوع المطبخ',
      'restaurant.priceRange': 'نطاق الأسعار',
      'restaurant.openNow': 'مفتوح الآن',
      'restaurant.closed': 'مغلق',

      // Menu
      'menu.addToCart': 'إضافة للسلة',
      'menu.customizations': 'التخصيصات',
      'menu.specialInstructions': 'تعليمات خاصة',
      'menu.vegetarian': 'نباتي',
      'menu.vegan': 'نباتي صرف',
      'menu.glutenFree': 'خالي من الجلوتين',
      'menu.spicy': 'حار',
      'menu.popular': 'شائع',

      // Cart
      'cart.title': 'سلة التسوق',
      'cart.empty': 'سلة التسوق فارغة',
      'cart.subtotal': 'المجموع الفرعي',
      'cart.tax': 'الضريبة',
      'cart.deliveryFee': 'رسوم التوصيل',
      'cart.total': 'المجموع الكلي',
      'cart.checkout': 'الدفع',
      'cart.quantity': 'الكمية',

      // Order
      'order.status': 'حالة الطلب',
      'order.pending': 'في الانتظار',
      'order.confirmed': 'مؤكد',
      'order.preparing': 'قيد التحضير',
      'order.readyForPickup': 'جاهز للاستلام',
      'order.outForDelivery': 'في الطريق',
      'order.delivered': 'تم التوصيل',
      'order.cancelled': 'ملغي',
      'order.trackOrder': 'تتبع الطلب',
      'order.refunded': 'مسترد',
      'order.title': 'الطلب',
      'order.placedOn': 'تم الطلب في',
      'order.loading': 'جاري تحميل تفاصيل الطلب...',
      'order.notFound.title': 'الطلب غير موجود',
      'order.notFound.message': 'الطلب الذي تبحث عنه غير موجود أو تم حذفه.',
      'order.notFound.backToOrders': 'العودة للطلبات',
      'order.cancelConfirm': 'هل أنت متأكد من إلغاء هذا الطلب؟',

      // Order Tracking
      'order.tracking.title': 'تتبع الطلب',
      'order.tracking.estimatedDelivery': 'وقت التوصيل المتوقع',
      'order.tracking.steps': 'خطوات',

      // Order Timeline
      'order.timeline.title': 'تسلسل الطلب الزمني',
      'order.timeline.updatedBy': 'تم التحديث بواسطة',

      // Order Items
      'order.items.title': 'عناصر الطلب',
      'order.items.quantity': 'الكمية',
      'order.items.each': 'للقطعة',

      // Order Actions
      'order.actions.title': 'إجراءات الطلب',
      'order.actions.cancel': 'إلغاء الطلب',
      'order.actions.cancelling': 'جاري الإلغاء...',
      'order.actions.reorder': 'إعادة الطلب',
      'order.actions.reordering': 'جاري إعادة الطلب...',
      'order.actions.viewRestaurant': 'عرض المطعم',

      // Order Summary
      'order.summary.title': 'ملخص الطلب',
      'order.summary.subtotal': 'المجموع الفرعي',
      'order.summary.tax': 'الضريبة',
      'order.summary.deliveryFee': 'رسوم التوصيل',
      'order.summary.free': 'مجاني',
      'order.summary.total': 'المجموع الكلي',

      // Order Delivery
      'order.delivery.title': 'معلومات التوصيل',
      'order.delivery.address': 'عنوان التوصيل',
      'order.delivery.instructions': 'تعليمات التوصيل',
      'order.delivery.paymentMethod': 'طريقة الدفع',

      // Orders List
      'orders.title': 'طلباتك',
      'orders.subtitle': 'تتبع وإدارة طلبات الطعام الخاصة بك',
      'orders.loading': 'جاري تحميل طلباتك...',
      'orders.empty.title': 'لا توجد طلبات',
      'orders.empty.filtered': 'لا توجد طلبات تطابق المرشحات الحالية.',
      'orders.empty.noOrders': 'لم تقم بأي طلبات بعد.',
      'orders.empty.browseRestaurants': 'تصفح المطاعم',
      'orders.orderNumber': 'الطلب',
      'orders.item': 'عنصر',
      'orders.items': 'عناصر',
      'orders.andMore': 'و',
      'orders.more': 'أكثر',
      'orders.total': 'المجموع',
      'orders.actions.track': 'تتبع',
      'orders.actions.reorder': 'إعادة طلب',
      'orders.actions.cancel': 'إلغاء',
      'orders.search.placeholder': 'البحث في الطلبات...',
      'orders.filter.allStatuses': 'جميع الحالات',
      'orders.sort.date': 'ترتيب حسب التاريخ',
      'orders.sort.status': 'ترتيب حسب الحالة',
      'orders.sort.total': 'ترتيب حسب المجموع',
      'orders.sort.newest': 'الأحدث أولاً',
      'orders.sort.oldest': 'الأقدم أولاً',

      // Pagination
      'pagination.previous': 'السابق',
      'pagination.next': 'التالي',
      'pagination.showing': 'عرض',
      'pagination.of': 'من',
      'pagination.results': 'نتائج',

      // Checkout
      'checkout.title': 'الدفع',
      'checkout.orderSummary': 'ملخص الطلب',
      'checkout.estimatedDelivery': 'وقت التوصيل المتوقع',
      'checkout.placeOrder': 'تأكيد الطلب',
      'checkout.placingOrder': 'جاري تأكيد الطلب...',
      'checkout.confirmation.title': 'تم تأكيد الطلب بنجاح!',
      'checkout.confirmation.message': 'شكراً لك على طلبك. ستتلقى رسالة تأكيد قريباً.',

      // Checkout Address
      'checkout.address.title': 'عنوان التوصيل',
      'checkout.address.saved': 'العناوين المحفوظة',
      'checkout.address.useCustom': 'استخدام عنوان مختلف',
      'checkout.address.street': 'عنوان الشارع',
      'checkout.address.streetPlaceholder': 'أدخل عنوان الشارع',
      'checkout.address.city': 'المدينة',
      'checkout.address.cityPlaceholder': 'أدخل المدينة',
      'checkout.address.state': 'المنطقة',
      'checkout.address.statePlaceholder': 'المنطقة',
      'checkout.address.zipCode': 'الرمز البريدي',
      'checkout.address.zipPlaceholder': 'الرمز البريدي',
      'checkout.address.instructions': 'تعليمات التوصيل',
      'checkout.address.instructionsPlaceholder': 'مثال: اطرق الجرس، اترك عند الباب، إلخ.',

      // Checkout Payment
      'checkout.payment.title': 'طريقة الدفع',

      // Checkout Review
      'checkout.review.title': 'مراجعة طلبك',
      'checkout.review.delivery': 'تفاصيل التوصيل',
      'checkout.review.payment': 'طريقة الدفع',
      'checkout.review.items': 'عناصر الطلب',
      'checkout.review.estimatedTime': 'وقت التوصيل المتوقع',

      // Theme
      'theme.light': 'الوضع الفاتح',
      'theme.dark': 'الوضع الداكن',
      'theme.auto': 'الوضع التلقائي',
      'theme.toggle': 'تبديل المظهر',

      // Language
      'language.english': 'English',
      'language.arabic': 'العربية',
      'language.toggle': 'تبديل اللغة',

      // App
      'app.title': 'RestaurantApp - توصيل الطعام',
      'app.name': 'RestaurantApp',

      // Navigation
      'nav.toggleNavigation': 'تبديل التنقل',
      'nav.dashboard': 'لوحة التحكم',

      // Landing Page
      'landing.hero.title': 'طعام لذيذ يُوصل بسرعة',
      'landing.hero.subtitle': 'اطلب من مطاعمك المفضلة واحصل على طعام طازج يُوصل إلى بابك في دقائق.',
      'landing.hero.browseRestaurants': 'تصفح المطاعم',
      'landing.hero.signUp': 'إنشاء حساب',
      'landing.offers.title': 'عروض خاصة',
      'landing.offers.subtitle': 'لا تفوت هذه العروض المذهلة!',
      'landing.featured.title': 'المطاعم المميزة',
      'landing.featured.subtitle': 'الخيارات الشائعة في منطقتك',
      'landing.featured.viewAll': 'عرض جميع المطاعم',
      'landing.howItWorks.title': 'كيف يعمل',
      'landing.howItWorks.step1.title': 'تصفح',
      'landing.howItWorks.step1.description': 'اختر من مئات المطاعم',
      'landing.howItWorks.step2.title': 'اطلب',
      'landing.howItWorks.step2.description': 'أضف العناصر للسلة وادفع',
      'landing.howItWorks.step3.title': 'استمتع',
      'landing.howItWorks.step3.description': 'احصل على طعام طازج يُوصل إلى بابك',

      // Offers (for landing page)
      'offers.freeDelivery.title': 'توصيل مجاني',
      'offers.freeDelivery.description': 'على الطلبات أكثر من 25 دولار',
      'offers.discount.title': 'خصم 20%',
      'offers.discount.description': 'خصم الطلب الأول',

      // Cart
      'cart.itemsInCart': 'عناصر في السلة',
      'cart.minimumOrder': 'أضف {{amount}} أكثر للحد الأدنى للطلب',

      // Menu Customization
      'menu.customization.textPlaceholder': 'أدخل تفضيلك...',
    }
  };

  constructor() {
    this.initializeLanguage();
  }

  get language() {
    return this.languageSignal;
  }

  get direction() {
    return this.directionSignal;
  }

  get currentLanguage(): Language {
    return this.languageSignal();
  }

  get currentDirection(): Direction {
    return this.directionSignal();
  }

  private initializeLanguage(): void {
    const savedLanguage = this.getSavedLanguage();
    const browserLanguage = this.getBrowserLanguage();

    const language = savedLanguage || browserLanguage || 'en';
    this.setLanguage(language);
  }

  setLanguage(language: Language): void {
    this.languageSignal.set(language);
    this.saveLanguage(language);
    this.applyLanguage(language);
  }

  toggleLanguage(): void {
    const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
    this.setLanguage(newLanguage);
  }

  translate(key: string, params?: Record<string, any>): string {
    const translation = this.getNestedTranslation(key);

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    if (params) {
      return this.interpolateParams(translation, params);
    }

    return translation;
  }

  private getNestedTranslation(key: string): string {
    const keys = key.split('.');
    let translation: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      translation = translation?.[k];
    }

    // If translation not found in current language, try English fallback
    if (!translation && this.currentLanguage !== 'en') {
      let fallback: any = this.translations['en'];
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      translation = fallback;
    }

    return translation || key;
  }

  private interpolateParams(translation: string, params: Record<string, any>): string {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] || match;
    });
  }

  private applyLanguage(language: Language): void {
    const htmlElement = document.documentElement;
    const direction = language === 'ar' ? 'rtl' : 'ltr';

    htmlElement.setAttribute('lang', language);
    htmlElement.setAttribute('dir', direction);

    // Update document title direction
    document.title = this.translate('app.title');
  }

  private getBrowserLanguage(): Language | null {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      return browserLang === 'ar' ? 'ar' : 'en';
    }
    return null;
  }

  private getSavedLanguage(): Language | null {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(this.LANGUAGE_KEY);
      return saved as Language || null;
    }
    return null;
  }

  private saveLanguage(language: Language): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.LANGUAGE_KEY, language);
    }
  }

  isRTL(): boolean {
    return this.currentDirection === 'rtl';
  }

  isLTR(): boolean {
    return this.currentDirection === 'ltr';
  }
}
