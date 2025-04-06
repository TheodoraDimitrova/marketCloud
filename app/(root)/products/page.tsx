"use client";
import { useEffect, Suspense } from "react";
import Banner from "@/components/shared/PageBanner";
import CategoriesCarousel from "@/components/shared/categoriesCarousel/CategoriesCarousel";
import { fetchAllProducts } from "@/store/slices/productsSlice";
import FilteredProductList from "@/components/shared/filteredProductList/FilteredProductList";
import Loading from "@/components/shared/Loading";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.products);

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

        <Suspense fallback={<Loading />}>
          <FilteredProductList
            products={products}
            totalProducts={products.length}
          />
        </Suspense>

        <CategoriesCarousel />
      </>
    );
  }
};

export default ProductsPage;
