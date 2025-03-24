import {CartItem} from './cart';

interface Shipping {
  method: string;
  cost: number;
  label: string;
}

export interface Order {
    cart: CartItem[];
    subtotal: number;
    totalSavings: number;
    totalAmount: number;
    shipping: Shipping;
    status: string;
    contact: string;
    subscribed: boolean;
    country: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    deliveryMethod: string;
    paymentMethod: string;
    _id: string;
    _updatedAt: string;

  }
  