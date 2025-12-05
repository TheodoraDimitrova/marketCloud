"use client";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Banner } from "@/components/ui/Banner";
import { urlFor } from "@/sanity/lib/image";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import SearchBar from "@/components/shared/common/SearchBar";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { setCategories } from "@/store/slices/categorySlice";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";

interface CategoryDetailsProps {
  category: Category;
  products: Product[];
}

const CategoryDetails = ({ category, products }: CategoryDetailsProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(setCategories([category]));
  }, [category, dispatch]);

  const filterProducts = useMemo(() => {
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
      <Banner
        title={category.name}
        subtitle={category.description}
        backgroundImage={urlFor(category.image)}
      />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
      />
      <FilteredProductList products={filterProducts} />
    </>
  );
};

export default CategoryDetails;
