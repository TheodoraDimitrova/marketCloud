"use client";

import { useEffect, useState } from "react";
import Banner from "@/components/shared/PageBanner";
import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";
import { fetchAllProducts } from "@/store/slices/productsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";
import Loading from "@/components/shared/Loading";
import SearchBar from "@/components/shared/SearchBar";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { products, status } = useSelector(
    (state: RootState) => state.products
  );

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
