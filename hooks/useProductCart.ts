import { Product } from "@/types/product";
import { useAppDispatch } from "./useAppDispatch";
import { addToCart } from "@/store/slices/cartSlice";
import { useState } from "react";

interface UseProductCartReturn {
  quantity: number;
  handleUpdateQuantity: (value: number) => void;
  handleAddToCart: () => void;
}

export const useProductCart = (product: Product): UseProductCartReturn => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      setQuantity(1);
    }
  };

  return { quantity, handleUpdateQuantity, handleAddToCart };
};
