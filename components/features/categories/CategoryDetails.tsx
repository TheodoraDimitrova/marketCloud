"use client";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Banner } from "@/components/ui/Banner";
import FilteredProductList from "@/components/features/products/FilteredProductList";
import SearchBar from "@/components/shared/common/SearchBar";
import Breadcrumb from "@/components/shared/common/Breadcrumb";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

interface CategoryDetailsProps {
  category: Category;
  products: Product[];
  categoryImageUrl?: string;
}

const CategoryDetails = ({
  category,
  products,
  categoryImageUrl,
}: CategoryDetailsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filterProducts = useMemo(() => {
    if (!products?.length) {
      return [];
    }

    if (!debouncedSearchTerm.trim()) {
      return products;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(searchLower);
      const brandMatch = product.brand?.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description
        ?.toLowerCase()
        .includes(searchLower);
      return nameMatch || brandMatch || descriptionMatch;
    });
  }, [products, debouncedSearchTerm]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: category?.name || "Category" },
  ];

  return (
    <>
      <div className="container mx-auto px-2 md:px-6 pt-1 md:pt-2 pb-0">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <Banner
        title={category?.name || "Category"}
        subtitle={category?.description}
        backgroundImage={categoryImageUrl}
      />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
        products={products}
        searchTerm={searchTerm}
      />
      <FilteredProductList products={filterProducts} />
    </>
  );
};

export default CategoryDetails;
