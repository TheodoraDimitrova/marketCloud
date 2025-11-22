"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import Banner from "@/components/ui/Banner";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchProductsByCategory } from "@/store/slices/productsSlice";
import { urlFor } from "@/sanity/lib/image";
import FilteredProductList from "@/components/features/products/filteredProductList/FilteredProductList";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/shared/common/SearchBar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const CategoryPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const category = pathname.split("/").pop();

  const dispatch = useAppDispatch();

  const { categories, status: categoriesStatus } = useAppSelector(
    (state) => state.categories
  );
  const { filteredProducts, status: ProductState } = useAppSelector(
    (state) => state.products
  );

  const [categoryData, setCategoryData] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [categoriesStatus, dispatch]);

  useEffect(() => {
    if (
      !category ||
      categoriesStatus !== "succeeded" ||
      categories.length === 0
    )
      return;

    const foundCategory = categories.find(
      (cat) => cat.slug.current === category.toLowerCase()
    );

    if (!foundCategory) {
      router.replace("/404");
      return;
    }

    setCategoryData({
      title: foundCategory.name,
      description: foundCategory.description,
      image: urlFor(foundCategory.image),
    });

    dispatch(fetchProductsByCategory(foundCategory._id));
  }, [category, categoriesStatus, categories, dispatch, router]);

  if (categoriesStatus === "loading" || ProductState === "loading") {
    return <Loading />;
  }

  if (!categoryData) return null;
  const filterProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Banner
        title={categoryData.title}
        subtitle={categoryData.description}
        backgroundImage={categoryData.image}
      />
      <SearchBar
        onSearch={(searchTerm) => {
          setSearchTerm(searchTerm);
        }}
      />
      <Suspense fallback={<Loading />}>
        <FilteredProductList
          products={filterProducts}
          totalProducts={filterProducts.length}
        />
      </Suspense>
    </>
  );
};

export default CategoryPage;
