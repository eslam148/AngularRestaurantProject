export interface RestaurantDTO {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    rating: number;
    imageUrl?: string;
    menuItems: MenuItemDTO[];
    isOpen: boolean;
    openingHours: string;
    closingHours: string;
}

export interface MenuItemDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable: boolean;
}
