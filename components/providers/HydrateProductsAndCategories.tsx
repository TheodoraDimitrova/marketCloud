"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setProducts } from "@/store/slices/productsSlice";
import { setCategories } from "@/store/slices/categorySlice";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface HydrateProps {
  products: Product[];
  categories: Category[];
}

const HydrateProductsAndCategories = ({
  products,
  categories,
}: HydrateProps) => {
  const dispatch = useAppDispatch();
  const currentProducts = useAppSelector((state) => state.products.products);
  const currentCategories = useAppSelector(
    (state) => state.categories.categories
  );

  useEffect(() => {
    const shouldHydrateProducts =
      !currentProducts ||
      currentProducts.length === 0 ||
      currentProducts.length !== products.length;

    const shouldHydrateCategories =
      !currentCategories ||
      currentCategories.length === 0 ||
      currentCategories.length !== categories.length;

    if (shouldHydrateProducts && products.length > 0) {
      dispatch(setProducts(products));
    }

    if (shouldHydrateCategories && categories.length > 0) {
      dispatch(setCategories(categories));
    }
  }, [dispatch, products, categories, currentProducts, currentCategories]);

  return null;
};

export default HydrateProductsAndCategories;
