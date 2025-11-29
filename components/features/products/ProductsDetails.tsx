"use client";
import { useState } from "react";
import { Banner } from "@/components/ui/Banner";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import SearchBar from "@/components/shared/common/SearchBar";
import CategoriesCarousel from "@/components/features/categories/categoriesCarousel/CategoriesCarousel";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface ProductsDetailsProps {
  products: Product[];
  categories: Category[];
}

const ProductsDetails: React.FC<ProductsDetailsProps> = ({
  products,
  categories,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Филтрира продуктите по search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
      />
      <FilteredProductList
        products={filteredProducts}
        totalProducts={filteredProducts.length}
      />
      <CategoriesCarousel />
    </>
  );
};

export default ProductsDetails;

