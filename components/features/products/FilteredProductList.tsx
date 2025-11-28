"use client";
import { useState } from "react";
import UtilityBar from "@/components/features/products/UtilityBar";
import SectionFilters from "@/components/shared/filters/index";
import ProductCard from "@/components/features/products/ProductCard";
import Link from "next/link";
import { Product } from "@/types/product";
import { useProductFilters } from "@/hooks/useProductFilters";

interface FilteredProductListProps {
  products: Product[];
  totalProducts: number;
}

const FilteredProductList: React.FC<FilteredProductListProps> = ({
  products,
}) => {
  const filteredProducts = useProductFilters(products);

  const [showFilters, setShowFilters] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <div>
      {products.length > 0 && (
        <UtilityBar
          toggleFilters={toggleFilters}
          totalProducts={filteredProducts.length}
          appliedFiltersCount={appliedFiltersCount}
          showFilters={showFilters}
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
        <div className="grid  w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-4 p-10 lg:gap-y-8 justify-items-center align-items-start">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="flex-center flex-col space-y-4">
              <p className="text-lg text-gray-700">
                Sorry, no products are available right now.
              </p>
              <Link href="/" className="underline text-red-500 w-full flex">
                <p>Go To Home Page</p>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredProductList;
