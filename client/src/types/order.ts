import type { IProduct } from "./product";

export interface IOrderAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface IOrderPayment {
    description: string;
}

export interface IOrderUser {
    name: string;
    cpf: string;
    phone: string;
    email: string;
}

export interface IOrderItem {
    product: IProduct;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface IOrder {
    id: number;
    date: string; 
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';
    shipping: number;
    total: number;
    discount: number;
    trackingCode?: string;
    address: IOrderAddress;
    payment: IOrderPayment;
    clientDetails: IOrderUser;
    items: IOrderItem[];
}