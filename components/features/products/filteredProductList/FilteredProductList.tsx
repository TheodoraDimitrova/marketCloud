"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import UtilityBar from "@/components/features/products/UtilityBar";
import SectionFilters from "@/components/shared/filters/index";
import ProductCard from "@/components/features/products/filteredProductList/ProductCard";
import Link from "next/link";
import { Product } from "@/types/product";

interface FilteredProductListProps {
  products: Product[];
  totalProducts: number;
}

const FilteredProductList: React.FC<FilteredProductListProps> = ({
  products,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleFilters = () => setShowFilters((prev) => !prev);

  useEffect(() => {
    const query: Record<string, string> = Object.fromEntries(
      searchParams.entries()
    );
    let filtered = products;

    if (query.priceRange) {
      const [minPrice, maxPrice] = query.priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (query.brands) {
      const brands = query.brands.split(",");
      filtered = filtered.filter((product) =>
        brands.includes(product.brand || "")
      );
    }

    if (query.discounts) {
      const discounts = query.discounts
        .split(",")
        .map((discount) => discount.trim().toLowerCase());
      filtered = filtered.filter((product) => {
        return discounts.some((discount) => {
          if (product.discount?.isActive && product.discount.amount) {
            return `-${product.discount.amount}%` === discount;
          }
          return product.tags?.some((tag) =>
            tag.label.toLowerCase().includes(discount)
          );
        });
      });
    }

    setFilteredProducts(filtered);
  }, [pathname, searchParams, products]);

  return (
    <div>
      {products.length > 0 && (
        <UtilityBar
          toggleFilters={toggleFilters}
          totalProducts={filteredProducts.length}
          appliedFiltersCount={appliedFiltersCount}
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

        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-4 p-10 lg:gap-y-8 justify-items-center align-items-start">
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
