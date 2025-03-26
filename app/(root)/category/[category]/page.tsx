"use client";

import { useEffect, useState, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import Banner from "@/components/shared/PageBanner";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchProductsByCategory } from "@/store/slices/productsSlice";
import { RootState, AppDispatch } from "@/store/store";
import { urlFor } from "@/sanity/lib/image";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";
import Loading from "@/components/shared/Loading";
import SearchBar from "@/components/shared/SearchBar";

const CategoryPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const category = pathname.split("/").pop();

  const dispatch = useDispatch<AppDispatch>();

  const { categories, status: categoriesStatus } = useSelector(
    (state: RootState) => state.categories
  );
  const { filteredProducts, status: ProductState } = useSelector(
    (state: RootState) => state.products
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
