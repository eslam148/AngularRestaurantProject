export enum OrderStatus {
    Pending = 'Pending',
    OnTheWay = 'OnTheWay',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled'
}

export interface OrderDTO {
    id: number;
    customerId: number;
    restaurantId: number;
    items: OrderItemDTO[];
    totalAmount: number;
    orderStatus: OrderStatus;
    deliveryAddressId: number;
    paymentId?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItemDTO {
    id: number;
    menuItemId: number;
    quantity: number;
    price: number;
    notes?: string;
}

export interface OrderForDeliveryDto extends OrderDTO {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
}

export interface OrderDetailsDto extends OrderForDeliveryDto {
    restaurant: {
        name: string;
        address: string;
        phone: string;
    };
}
