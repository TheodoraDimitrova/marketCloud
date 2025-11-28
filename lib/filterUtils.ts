import { Product } from "@/types/product";

// Helper function to normalize tag labels to uppercase
const normalizeToUpperCase = (str: string): string => {
  return str.trim().toUpperCase();
};

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
  const discountList = discounts.split(",").map((discount) => discount.trim());

  return products.filter((product) => {
    return discountList.some((filterDiscount) => {
      // 1. Check if product has active discount matching the filter
      if (product.discount?.isActive && product.discount.amount) {
        if (product.discount.type === "percentage") {
          // Match percentage discount: "-20%" === "-20%"
          const productDiscountLabel = `-${product.discount.amount}%`;
          if (productDiscountLabel === filterDiscount) {
            return true;
          }
        } else if (product.discount.type === "fixed") {
          // Match fixed discount: "-5€" === "-5€"
          const productDiscountLabel = `-${product.discount.amount}€`;
          if (productDiscountLabel === filterDiscount) {
            return true;
          }
        }
      }

      // 2. Check if product tags match the discount filter
      // All tags (discount, new, limited, etc.) - normalized to uppercase
      if (product.tags && product.tags.length > 0) {
        return product.tags.some((tag) => {
          if (tag.label) {
            // Normalize both to uppercase for comparison
            const normalizedTagLabel = normalizeToUpperCase(tag.label.trim());
            const normalizedFilterDiscount = normalizeToUpperCase(
              filterDiscount.trim()
            );
            return normalizedTagLabel === normalizedFilterDiscount;
          }
          return false;
        });
      }

      return false;
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
