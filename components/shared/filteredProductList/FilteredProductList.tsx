import { useState } from "react";
import UtilityBar from "@/components/shared/utilityBar/UtilityBar";
import SectionFilters from "@/components/SectionFilters/SectionFilters";
import ProductCard from "@/components/shared/productCard/ProductCard";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
}

interface FilteredProductListProps {
  products: Product[];
  totalProducts: number;
}

const FilteredProductList: React.FC<FilteredProductListProps> = ({
  products,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  return (
    <div>
      {products.length > 0 && (
        <UtilityBar
          toggleFilters={toggleFilters}
          totalProducts={products.length}
        />
      )}

      <div className="container w-full h-full flex mx-auto">
        {showFilters && (
          <>
            <div className="fixed inset-0 w-full lg:relative min-h-screen bg-black opacity-50 z-50 lg:hidden" />
            <SectionFilters
              toggleFilters={toggleFilters}
              showFilter={showFilters}
            />
          </>
        )}

        <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-4 p-10 lg:gap-y-8 justify-items-center items-center">
          {products.length > 0 ? (
            products.map((product) => (
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
