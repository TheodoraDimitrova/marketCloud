export interface CartItem {
    _id: string;
    name: string;
    images: { _type?: string; asset: { _ref: string } }[]; 
    quantity: number;
    price: number;
    discountedPrice?: number;
    discount?: { isActive: boolean; amount: number; type: string }; 
    subtotalSingleProduct?: number;
  }

  export interface CartState {
    items: CartItem[];
    subtotal: number; 
    totalSavings: number;
    totalAmount: number;
    shipping: {
      method: string | null,
      cost: number,
      label: string,
    };
  }
