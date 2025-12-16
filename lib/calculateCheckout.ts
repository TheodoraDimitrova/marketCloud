import { CartItem } from "@/lib/types/cart";

export const calculateDiscountedPrice = (item: CartItem): number => {
  if (!item.discount?.isActive) return item.price;
  let discountedPrice = item.price;
  if (item.discount.type === "percentage") {
    discountedPrice = item.price - (item.price * item.discount.amount) / 100;
  } else if (item.discount.type === "fixed") {
    discountedPrice = Math.max(item.price - item.discount.amount, 0);
  }
  return discountedPrice;
};

export const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0
  );
};

export const calculateTotalSavings = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => {
    const originalPrice = item.price * item.quantity;
    const discountedPrice = calculateDiscountedPrice(item) * item.quantity;

    return sum + (originalPrice - discountedPrice);
  }, 0);
};
