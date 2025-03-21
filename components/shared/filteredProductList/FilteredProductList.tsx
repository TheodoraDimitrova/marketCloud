"use client";
import { useEffect, useState } from "react";
import UtilityBar from "@/components/shared/utilityBar/UtilityBar";
import SectionFilters from "@/components/SectionFilters/SectionFilters";
import ProductCard from "@/components/shared/productCard/ProductCard";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  discount?: {
    isActive: boolean;
    amount: number;
    type: string;
  };
}

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
    const query = Object.fromEntries(searchParams.entries());
    let filtered = products;

    if (query.priceRange) {
      const [minPrice, maxPrice] = query.priceRange.split("-").map(Number);
      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (query.brands) {
      const brands = query.brands.split(",");
      filtered = filtered.filter((product) => brands.includes(product.brand));
    }
    if (query.discounts) {
      const discounts = query.discounts
        .split(",")
        .map((discount) => discount.trim());
      filtered = filtered.filter((product) => {
        const hasDiscount = discounts.some((discount) => {
          if (product.discount?.isActive && product.discount.amount) {
            const discountValue = `-${product.discount.amount}%`;
            return discountValue === discount;
          }
          return product.tags?.some((tag) => tag.label.includes(discount));
        });
        return hasDiscount;
      });
    }
    setFilteredProducts(filtered);
  }, [appliedFiltersCount, searchParams, pathname, products]);

  return (
    <div>
      {products.length > 0 && (
        <UtilityBar
          toggleFilters={toggleFilters}
          totalProducts={products.length}
          appliedFiltersCount={appliedFiltersCount}
        />
      )}

      <div className="container w-full h-full flex mx-auto">
        {showFilters && (
          <>
            <div className="fixed inset-0 w-full lg:relative min-h-screen bg-black opacity-50 z-50 lg:hidden" />
            <SectionFilters
              onFiltersChange={(count) => setAppliedFiltersCount(count)}
              toggleFilters={toggleFilters}
              showFilter={showFilters}
            />
          </>
        )}

        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-4 p-10 lg:gap-y-8 justify-items-center items-center">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="flex flex-col justify-center items-center space-y-4">
              <p className="text-lg text-gray-700">
                Sorry, no products are available right now.
              </p>

              <Link href="/" className="underline text-red-500 w-full flex ">
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
