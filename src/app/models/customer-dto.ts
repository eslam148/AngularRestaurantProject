import { AddressDTO } from './address-dto';
import { OrderDTO } from './order-dto';

export interface CustomerDTO {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    addresses?: AddressDTO[];
    orders?: OrderDTO[];
}

export interface CustomerProfileDTO extends CustomerDTO {
    role: string;
}
