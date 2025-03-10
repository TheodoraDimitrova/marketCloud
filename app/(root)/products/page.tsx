"use client";
import React from "react";
import Banner from "@/components/shared/banner/Benner";
import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";
import { useSelector } from "react-redux";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllProducts } from "@/store/slices/productsSlice";
import { RootState } from "@/store/store";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";

const ProductsPage = () => {
  const { status, error } = useFetchData(fetchAllProducts, "products");
  const products = useSelector((state: RootState) => state.products.products);

  if (status === "loading") {
    return <p>Loading products...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  {
    return (
      <>
        <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />

        <FilteredProductList products={products} />

        <CategoriesCarousel />
      </>
    );
  }
};

export default ProductsPage;
