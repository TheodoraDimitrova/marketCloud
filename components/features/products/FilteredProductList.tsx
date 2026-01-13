"use client";
import { useState, useEffect, useMemo } from "react";
import UtilityBar from "@/components/features/products/UtilityBar";
import SectionFilters from "@/components/shared/filters/index";
import ProductCard from "@/components/features/products/ProductCard";
import { Product } from "@/lib/types/product";
import { useProductFilters } from "@/hooks/useProductFilters";
import { Button } from "@/components/ui/Button";

interface FilteredProductListProps {
  products: Product[];
}

const ITEMS_PER_PAGE = 18;
const LOAD_MORE_INCREMENT = 6;

type SortOption =
  | "a-z"
  | "z-a"
  | "low-to-high"
  | "high-to-low"
  | "old-to-new"
  | "new-to-old";

const FilteredProductList = ({ products }: FilteredProductListProps) => {
  const filteredProducts = useProductFilters(products);

  const [showFilters, setShowFilters] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [sortOption, setSortOption] = useState<SortOption | null>(null);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  // Sort products based on selected option
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    // If no sort option selected, return original order
    if (!sortOption) {
      return sorted;
    }

    switch (sortOption) {
      case "a-z":
        return sorted.sort((a, b) =>
          a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase())
        );
      case "z-a":
        return sorted.sort((a, b) =>
          b.name.trim().toLowerCase().localeCompare(a.name.trim().toLowerCase())
        );
      case "low-to-high":
        return sorted.sort((a, b) => a.price - b.price);
      case "high-to-low":
        return sorted.sort((a, b) => b.price - a.price);
      case "old-to-new":
        return sorted.sort((a, b) => {
          if (!a._createdAt || !b._createdAt) return 0;
          return (
            new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime()
          );
        });
      case "new-to-old":
        return sorted.sort((a, b) => {
          if (!a._createdAt || !b._createdAt) return 0;
          return (
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
          );
        });
      default:
        return sorted;
    }
  }, [filteredProducts, sortOption]);

  // Reset displayed count when filters or sort changes
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [filteredProducts.length, sortOption]);

  const displayedProducts = sortedProducts.slice(0, displayedCount);
  const hasMore = displayedCount < sortedProducts.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + LOAD_MORE_INCREMENT);
  };

  return (
    <div>
      {products.length > 0 && (
        <UtilityBar
          toggleFilters={toggleFilters}
          totalProducts={filteredProducts.length}
          appliedFiltersCount={appliedFiltersCount}
          showFilters={showFilters}
          onSortChange={setSortOption}
        />
      )}

      <div className="container w-full h-full flex mx-auto">
        <>
          {showFilters && (
            <div className="fixed inset-0 w-full lg:relative min-h-screen bg-black opacity-50 z-10 lg:hidden" />
          )}
          <SectionFilters
            onFiltersChange={(count) => setAppliedFiltersCount(count)}
            toggleFilters={toggleFilters}
            showFilter={showFilters}
            products={products}
          />
        </>

        {/* Product List */}
        <div className="w-full">
          <div className="grid  w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-4 p-10 lg:gap-y-8 justify-items-center align-items-start">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : products.length > 0 ? (
              <div className="flex-center flex-col space-y-4">
                <p className="text-lg text-gray-700">
                  No products match your selected filters. Try adjusting your
                  search.
                </p>
              </div>
            ) : (
              <div className="flex-center flex-col space-y-4">
                <p className="text-lg text-gray-700">
                  Sorry, no products are available right now.
                </p>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center py-8">
              <Button onClick={handleLoadMore} variant="default">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredProductList;
