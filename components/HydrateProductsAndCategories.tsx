"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "@/store/slices/productsSlice";
import { setCategories } from "@/store/slices/categorySlice";

const HydrateProductsAndCategories = ({ products, categories }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProducts(products));
    dispatch(setCategories(categories));
  }, [dispatch, products, categories]);

  return null;
};

export default HydrateProductsAndCategories;
