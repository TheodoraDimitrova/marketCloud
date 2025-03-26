"use client";
import React, { useEffect } from "react";
import Banner from "@/components/shared/PageBanner";
import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllProducts } from "@/store/slices/productsSlice";
import { RootState, AppDispatch } from "@/store/store";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";
import Loading from "@/components/shared/Loading";

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { products, status, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  {
    return (
      <>
        <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />

        <FilteredProductList
          products={products}
          totalProducts={products.length}
        />

        <CategoriesCarousel />
      </>
    );
  }
};

export default ProductsPage;
