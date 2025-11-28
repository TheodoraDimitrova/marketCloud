import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  calculateDiscountedPrice,
  calculateSubtotal,
  calculateTotalSavings,
} from "@/lib/calculateCheckout";
import { CartItem, CartState } from "@/types/cart";

const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalSavings: 0,
  totalAmount: 0,
  shipping: {
    method: null,
    cost: 0,
    label: "",
  },
};

type DeliveryMethodPayload = { method: string; cost: number; label: string };
type SetCartFromOrderPayload = {
  cart: CartItem[];
  shipping: {
    method: string | null;
    cost: number;
    label: string;
  };
  totalAmount: number;
  totalSavings: number;
};

const recalculateCartTotals = (state: CartState) => {
  state.subtotal = calculateSubtotal(state.items);
  state.totalSavings = calculateTotalSavings(state.items);
  state.totalAmount = state.subtotal + state.shipping.cost;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const product = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === product._id
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += product.quantity;
      } else {
        const discountedPrice = calculateDiscountedPrice(product);
        const subtotalSingleProduct = discountedPrice * product.quantity;

        const newItem = {
          ...product,
          discountedPrice,
          subtotalSingleProduct,
        };
        state.items.push(newItem);
      }

      recalculateCartTotals(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      recalculateCartTotals(state);
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item._id === action.payload.id);
      if (item) {
        const newQuantity = item.quantity + action.payload.quantity;
        if (newQuantity <= 0) {
          state.items = state.items.filter(
            (item) => item._id !== action.payload.id
          );
        } else {
          item.quantity += action.payload.quantity;
          const discountedPrice = calculateDiscountedPrice(item);
          item.discountedPrice = discountedPrice;
          const subtotalSingleProduct = discountedPrice * item.quantity;
          item.subtotalSingleProduct = subtotalSingleProduct;
        }
      }
      recalculateCartTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalSavings = 0;
      state.totalAmount = 0;
    },
    setDeliveryMethod: (
      state,
      action: PayloadAction<DeliveryMethodPayload>
    ) => {
      state.shipping = action.payload;
      state.totalAmount = state.subtotal + action.payload.cost;
    },
    setCartFromOrder: (
      state,
      action: PayloadAction<SetCartFromOrderPayload>
    ) => {
      state.items = action.payload.cart;
      state.shipping = action.payload.shipping;
      recalculateCartTotals(state);
    },
  },
});

export const {
  addToCart,
  updateItemQuantity,
  removeFromCart,
  setDeliveryMethod,
  setCartFromOrder,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
