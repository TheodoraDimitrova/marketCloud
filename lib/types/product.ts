export interface Discount {
  isActive: boolean;
  type: string;
  amount: number;
}

export interface Tag {
  label: string;
  type: string;
  _key: string;
}

interface Slug {
  current: string;
}

export interface Product {
  _id: string;
  slug: Slug;
  name: string;
  description: string;
  price: number;
  package: string;
  rating?: number; // Optional - calculated from reviews
  tags?: Tag[];
  discount?: Discount;
  productDetails: string[];
  images: { asset: { _ref: string } }[];
  brand?: string;
  sizes?: string[]; // sizes are optional
  category?: {
    _ref?: string;
    _type?: string;
    _id?: string;
    name?: string;
    slug?: { current: string };
  };
  _createdAt?: string;
  _updatedAt?: string;
}
