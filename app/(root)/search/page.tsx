"use client";

import React, { useState } from "react";
import Banner from "@/components/shared/banner/Benner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllProducts } from "@/store/slices/productsSlice";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";
import Loading from "@/components/shared/loading/loading";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { status, error } = useFetchData(fetchAllProducts, "products");
  const products = useSelector((state: RootState) => state.products.products);

  const handleSearch = () => {
    console.log("Search For:", searchTerm);
  };
  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Banner title="Search Adora" backgroundImage="/images/bg1.png" />

      {/* Search bar */}
      <div className="container w-[80%] md:max-w-[650px] md:w-full mx-auto my-10 md:my-20">
        <div className="relative mt-4">
          <Input
            className="p-2 pl-10 bg-gray-200 w-full placeholder:text-gray-500 placeholder:text-lg border-none"
            placeholder="Search our Store"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute inset-y-0 right-3 w-6 h-6 top-2 text-gray-500"
            onClick={handleSearch}
          />
        </div>
      </div>
      {/* Search bar */}

      <FilteredProductList
        products={products}
        totalProducts={products.length}
      />

      <CategoriesCarousel />
    </>
  );
};

export default SearchPage;
