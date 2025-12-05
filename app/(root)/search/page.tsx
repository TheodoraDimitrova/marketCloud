"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.products);

  const hasRequestedProducts = useRef(false);

  useEffect(() => {
    if (
      (!products || products.length === 0) &&
      status !== "loading" &&
      !hasRequestedProducts.current
    ) {
      hasRequestedProducts.current = true;
      dispatch(fetchAllProducts());
    }

    if (hasRequestedProducts.current && products && products.length > 0) {
      hasRequestedProducts.current = false;
    }
  }, [dispatch, products, status]);

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

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <ErrorMessage message={error || "Failed to load products"} />;
  }

  return (
    <>
      <Banner title="Search Adora" backgroundImage="/images/bg1.png" />

      <div className="container mx-auto my-10 md:my-20">
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <FilteredProductList products={filteredProducts} />
      <CategoriesCarousel />
    </>
  );
};

export default SearchPage;
