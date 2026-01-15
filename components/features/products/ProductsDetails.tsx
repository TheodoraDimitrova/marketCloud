"use client";
import { useState, useMemo, Suspense } from "react";
import { Banner } from "@/components/ui/Banner";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import SearchBar from "@/components/shared/common/SearchBar";
import CategoriesCarousel from "@/components/features/categories/categoriesCarousel/CategoriesCarousel";
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";
import { useDebounce } from "@/hooks/useDebounce";
import { Loading } from "@/components/ui/Loading";

interface ProductsDetailsProps {
  products: Product[];
  categories?: Category[];
}

const ProductsDetails = ({
  products,
  categories = [],
}: ProductsDetailsProps) => {
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
    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(searchLower);
      const brandMatch = product.brand?.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description?.toLowerCase().includes(searchLower);
      return nameMatch || brandMatch || descriptionMatch;
    });
  }, [products, debouncedSearchTerm]);

  return (
    <>
      <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
        products={products}
        searchTerm={searchTerm}
      />
      <Suspense fallback={<Loading />}>
        <FilteredProductList products={filteredProducts} />
      </Suspense>
      {categories.length > 0 && <CategoriesCarousel categories={categories} />}
    </>
  );
};

export default ProductsDetails;
