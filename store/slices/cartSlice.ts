import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculateDiscountedPrice, calculateSubtotal, calculateTotalSavings } from "@/lib/calculateCheckout";
import { CartItem } from "@/types/cart";


const saveToLocalStorage = (cart: CartState) => {
  if (typeof window !== "undefined") {  // Проверка за наличност на window (за да не се изпълнява на сървъра)
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

// Четене на данни от Local Storage
const loadFromLocalStorage = (): CartState => {
  if (typeof window !== "undefined") {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      return JSON.parse(cartData);
    }
  }
  return { 
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
};

interface CartState {
  items: CartItem[];
  subtotal: number; 
  totalSavings: number;
  totalAmount: number;
  shipping: {
    method: string | null,
    cost: number,
    label: string,
  };
}

const initialState: CartState = loadFromLocalStorage();  

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

      state.subtotal = calculateSubtotal(state.items);
      state.totalSavings = calculateTotalSavings(state.items);
      state.totalAmount = state.subtotal  + state.shipping.cost  ;

      saveToLocalStorage(state);  
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
      state.totalSavings = calculateTotalSavings(state.items);
      state.totalAmount = state.subtotal  + state.shipping.cost  ;

      saveToLocalStorage(state);  
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item._id === action.payload.id);

      if (item) {
        const newQuantity = item.quantity + action.payload.quantity;
        if (newQuantity <= 0) {
          state.items = state.items.filter(item => item._id !== action.payload.id);
        } else {
          item.quantity += action.payload.quantity;
          const discountedPrice = calculateDiscountedPrice(item);
          item.discountedPrice = discountedPrice;
          const subtotalSingleProduct = discountedPrice * item.quantity;
          item.subtotalSingleProduct = subtotalSingleProduct;
        }
      }

      state.subtotal = calculateSubtotal(state.items);
      state.totalSavings = calculateTotalSavings(state.items);
      state.totalAmount = state.subtotal  + state.shipping.cost ;

      saveToLocalStorage(state);  
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalSavings = 0;
      state.totalAmount = 0;

      saveToLocalStorage(state); 
    },
    setDeliveryMethod: (state, action: PayloadAction<{ method: string; cost: number; label: string }>) => {
      state.shipping = action.payload;
      state.totalAmount = state.subtotal + action.payload.cost;

      saveToLocalStorage(state); 
    },
    setCartFromOrder: (state, action) => {
      state.items = action.payload.cart;
      state.subtotal = action.payload.subtotal;
      state.shipping = action.payload.shipping;
      state.totalAmount = action.payload.totalAmount;
      state.totalSavings = action.payload.totalSavings;

      saveToLocalStorage(state);  
    },
  },
});

export const { addToCart, updateItemQuantity, removeFromCart, setDeliveryMethod, setCartFromOrder } = cartSlice.actions;
export default cartSlice.reducer;
