"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
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

  useEffect(() => {
    dispatch(setProducts(products));
    dispatch(setCategories(categories));
  }, [dispatch, products, categories]);

  return null;
};

export default HydrateProductsAndCategories;
