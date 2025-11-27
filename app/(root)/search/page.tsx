"use client";

import { useEffect, useState } from "react";
import { Banner } from "@/components/ui/Banner";
import CategoriesCarousel from "@/components/features/categories/categoriesCarousel/CategoriesCarousel";
import { fetchAllProducts } from "@/store/slices/productsSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import { Loading } from "@/components/ui/Loading";
import SearchBar from "@/components/shared/common/SearchBar";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    if (status === "failed") {
      return <ErrorMessage message={error || "Failed to load products"} />;
    }
  }

  return (
    <>
      <Banner title="Search Adora" backgroundImage="/images/bg1.png" />

      <div className="container mx-auto my-10 md:my-20">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <FilteredProductList
        products={filteredProducts}
        totalProducts={products.length}
      />
      <CategoriesCarousel />
    </>
  );
};

export default SearchPage;
