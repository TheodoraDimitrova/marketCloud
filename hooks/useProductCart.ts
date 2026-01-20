import { Product } from "@/lib/types/product";
import { useAppDispatch } from "./useAppDispatch";
import { addToCart } from "@/store/slices/cartSlice";
import { useState } from "react";

interface UseProductCartReturn {
  quantity: number;
  isLoading: boolean;
  handleUpdateQuantity: (value: number) => void;
  handleAddToCart: () => void;
}

export const useProductCart = (product: Product): UseProductCartReturn => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleUpdateQuantity = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product && !isLoading) {
      setIsLoading(true);
      try {
        // Small delay to show loading state and prevent double-clicks
        await new Promise((resolve) => setTimeout(resolve, 200));
        dispatch(addToCart({ ...product, quantity }));
        setQuantity(1);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { quantity, isLoading, handleUpdateQuantity, handleAddToCart };
};
