/**
 * Admin panel order types. Mapped from Sanity order documents.
 */

export interface AdminOrderListItem {
  id: string;
  orderNumber: string;
  date: string;
  /** ISO date string from Sanity _createdAt, for local-time filtering */
  createdAt?: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod?: string;
  tracking?: string;
}

export interface AdminOrderDetail extends AdminOrderListItem {
  paymentMethod: string;
  transactionId?: string;
  subtotal?: number;
  totalSavings?: number;
  shippingAddress: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  shipping?: {
    method?: string | null;
    cost?: number;
    label?: string;
  };
  items: Array<{
    product: string;
    variant: string;
    qty: number;
    price: number;
    originalPrice?: number;
    discount?: number;
    discountAmount?: number;
    discountType?: string;
  }>;
  notes: string[];
}

/** Raw order as returned from Sanity GROQ */
export interface SanityOrder {
  _id: string;
  _createdAt?: string;
  orderNumber?: string;
  tracking?: string;
  contact?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount?: number;
  subtotal?: number;
  totalSavings?: number;
  shipping?: { method?: string; cost?: number; label?: string };
  status?: string;
  cart?: Array<{
    name?: string;
    quantity?: number;
    price?: number;
    discountedPrice?: number;
    subtotalSingleProduct?: number;
    discount?: {
      amount?: number;
      type?: string;
      isActive?: boolean;
    };
  }>;
}
