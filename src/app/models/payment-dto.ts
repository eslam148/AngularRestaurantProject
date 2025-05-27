export interface PaymentDTO {
    id: number;
    orderId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    createdAt: Date;
}

export enum PaymentMethod {
    CreditCard = 'CreditCard',
    DebitCard = 'DebitCard',
    Cash = 'Cash'
}

export enum PaymentStatus {
    Pending = 'Pending',
    Completed = 'Completed',
    Failed = 'Failed',
    Refunded = 'Refunded'
}
