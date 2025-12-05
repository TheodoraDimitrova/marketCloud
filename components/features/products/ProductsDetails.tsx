"use client";
import { useState, useMemo } from "react";
import { Banner } from "@/components/ui/Banner";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import SearchBar from "@/components/shared/common/SearchBar";
import CategoriesCarousel from "@/components/features/categories/categoriesCarousel/CategoriesCarousel";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductsDetailsProps {
  products: Product[];
}

const ProductsDetails = ({ products }: ProductsDetailsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredProducts = useMemo(() => {
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
      <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
      />
      <FilteredProductList products={filteredProducts} />
      <CategoriesCarousel />
    </>
  );
};

export default ProductsDetails;
