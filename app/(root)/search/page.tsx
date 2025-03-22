"use client";

import React, { useState } from "react";
import Banner from "@/components/shared/banner/Benner";

import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllProducts } from "@/store/slices/productsSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";
import Loading from "@/components/shared/loading/loading";
import SearchBar from "@/components/shared/searchBar/SearchBar";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { status, error } = useFetchData(fetchAllProducts, "products");
  const products = useSelector((state: RootState) => state.products.products);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
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
