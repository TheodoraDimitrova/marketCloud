"use client";
import { useState } from "react";
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

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  category,
  products,
}) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(setCategories([category]));
  }, [category, dispatch]);

  const filterProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <FilteredProductList
        products={filterProducts}
        totalProducts={filterProducts.length}
      />
    </>
  );
};

export default CategoryDetails;
