export interface CartItem {
    _id: string;
    name: string;
    images: { _type: string; asset: { _ref: string } }[]; 
    quantity: number;
    price: number;
    discountedPrice?: number;
    discount?: { isActive: boolean; amount: number; type: string };
  }