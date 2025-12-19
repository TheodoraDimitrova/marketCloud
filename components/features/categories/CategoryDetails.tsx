"use client";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Banner } from "@/components/ui/Banner";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import SearchBar from "@/components/shared/common/SearchBar";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

interface CategoryDetailsProps {
  category: Category;
  products: Product[];
  categoryImageUrl?: string; 
}

const CategoryDetails = ({
  category,
  products,
  categoryImageUrl,
}: CategoryDetailsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filterProducts = useMemo(() => {
    if (!products?.length) {
      return [];
    }

    if (!debouncedSearchTerm.trim()) {
      return products;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchLower)
    );
  }, [products, debouncedSearchTerm]);

  return (
    <>
      <Banner
        title={category.name}
        subtitle={category.description}
        backgroundImage={categoryImageUrl}
      />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
      />
      <FilteredProductList products={filterProducts} />
    </>
  );
};

export default CategoryDetails;
