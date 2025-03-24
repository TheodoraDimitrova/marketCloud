export interface Discount {
  isActive: boolean;
    type: string;
  amount: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  package: string;
  rating: number;
  tags: string[];
  discount?: Discount;
  productDetails: string[];
  images: { asset: { _ref: string } }[]; 
  brand?: string
}   