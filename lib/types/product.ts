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
  rating: number;
  tags?: Tag[]; // tags are optional
  discount?: Discount; // discount is optional
  productDetails: string[];
  images: { asset: { _ref: string } }[]; 
  brand?: string;
  category?: { _ref: string; _type: string }; // Sanity reference
  _createdAt?: string; // Sanity automatic field
  _updatedAt?: string; // Sanity automatic field
}