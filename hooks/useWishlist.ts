import { useAppDispatch, useAppSelector } from "./useAppDispatch";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import { Product } from "@/lib/types/product";

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product._id)) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
  };
};
