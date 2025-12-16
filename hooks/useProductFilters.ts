import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types/product";
import { applyFilters, FilterParams } from "@/lib/filterUtils";

export const useProductFilters = (products: Product[]): Product[] => {
  const searchParams = useSearchParams();

  const filters: FilterParams = useMemo(() => {
    const query: Record<string, string> = Object.fromEntries(
      searchParams.entries()
    );

    return {
      priceRange: query.priceRange,
      brands: query.brands,
      discounts: query.discounts,
    };
  }, [searchParams]);

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    if (!products?.length) {
      return [];
    }
    return applyFilters(products, filters);
  }, [products, filters]);

  return filteredProducts;
};
