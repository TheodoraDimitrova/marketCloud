import { Product } from "@/types/product";

export interface FilterParams {
  priceRange?: string;
  brands?: string;
  discounts?: string;
}

export const applyPriceFilter = (
  products: Product[],
  priceRange: string
): Product[] => {
  const [minPrice, maxPrice] = priceRange.split("-").map(Number);
  return products.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );
};

export const applyBrandFilter = (
  products: Product[],
  brands: string
): Product[] => {
  const brandList = brands.split(",");
  return products.filter((product) => brandList.includes(product.brand || ""));
};

export const applyDiscountFilter = (
  products: Product[],
  discounts: string
): Product[] => {
  const discountList = discounts
    .split(",")
    .map((discount) => discount.trim().toLowerCase());

  return products.filter((product) => {
    return discountList.some((discount) => {
      // Check if product has active discount matching the filter
      if (product.discount?.isActive && product.discount.amount) {
        return `-${product.discount.amount}%` === discount;
      }
      // Check if product tags match the discount filter
      return product.tags?.some((tag) =>
        tag.label.toLowerCase().includes(discount)
      );
    });
  });
};

export const applyFilters = (
  products: Product[],
  filters: FilterParams
): Product[] => {
  let filtered = products;

  if (filters.priceRange) {
    filtered = applyPriceFilter(filtered, filters.priceRange);
  }

  if (filters.brands) {
    filtered = applyBrandFilter(filtered, filters.brands);
  }

  if (filters.discounts) {
    filtered = applyDiscountFilter(filtered, filters.discounts);
  }

  return filtered;
};
