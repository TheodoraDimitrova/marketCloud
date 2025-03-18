import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculateDiscountedPrice, calculateSubtotal,calculateTotalSavings } from "@/lib/calculateCheckout";

interface Discount {
  isActive: boolean;
  type: "percentage" | "fixed";
  amount: number;
}
interface CartItem {
  _id: string;
  price: number;
  discount?: Discount;
  quantity: number;
  discountedPrice?: number;
  subtotalSingleProduct: number;

}

interface CartState {
  items: CartItem[];
  subtotal: number; 
  totalSavings: number;
  totalAmount: number;
  shipping: {
    method: string |null ,
    cost: number,
    label: string,
  },

}
const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalSavings:0,
  totalAmount:0,
  shipping: {
    method: null,
    cost: 0,
    label: "",
  },
}


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
      state.totalSavings= calculateTotalSavings(state.items)
      state.totalAmount = state.subtotal + state.shipping.cost;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.subtotal = calculateSubtotal(state.items);
      state.totalSavings= calculateTotalSavings(state.items)
      state.totalAmount = state.subtotal + state.shipping.cost;
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
   
     const item = state.items.find(item => item._id === action.payload.id);

      if (item) { 
        const newQuantity = item.quantity + action.payload.quantity;
        if (newQuantity <= 0) {
          state.items = state.items.filter(item => item._id !== action.payload.id);
        }else{
          item.quantity += action.payload.quantity;
          const discountedPrice = calculateDiscountedPrice(item);
          item.discountedPrice = discountedPrice;
          const subtotalSingleProduct = discountedPrice * item.quantity;
          item.subtotalSingleProduct = subtotalSingleProduct;
      
        }
      }
      state.subtotal = calculateSubtotal(state.items);
      state.totalSavings=calculateTotalSavings(state.items)
      state.totalAmount = state.subtotal + state.shipping.cost;
    },
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0; 
      state.totalSavings=0;
      state.totalAmount = 0;
    },
    setDeliveryMethod: (state, action: PayloadAction<{ method: string; cost: number; label: string }>) => {
      state.shipping = action.payload;
      state.totalAmount = state.subtotal + action.payload.cost;
    },
  
  },
});

export const { addToCart, updateItemQuantity ,removeFromCart, setDeliveryMethod} = cartSlice.actions;
export default cartSlice.reducer;
