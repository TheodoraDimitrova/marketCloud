import type { Product } from "@/lib/types/product";

/**
 * Admin panel product. Reuses Product fields where they match;
 * adds/overrides only what the admin UI needs (id, image URL, status, stock, category name).
 */
export type AdminProduct = Pick<Product, "name" | "price" | "brand"> & {
  id: string;
  description?: string;
  image?: string;
  status: "Active" | "Draft" | "Out of stock";
  stock?: number;
  sku?: string;
  category?: string;
};

/** Raw product as returned from Sanity GROQ */
export interface SanityProduct {
  _id: string;
  _createdAt?: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  quantity?: number;
  sku?: string;
  brand?: string;
  images?: Array<{
    asset?: {
      _ref?: string;
    };
  }>;
  category?: {
    _id?: string;
    name?: string;
  };
  discount?: {
    amount?: number;
    type?: string;
    isActive?: boolean;
  };
  tags?: Array<{
    type?: string;
    label?: string;
  }>;
}
