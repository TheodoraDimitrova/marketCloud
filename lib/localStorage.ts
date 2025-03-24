
import {CartState} from '@/types/cart'

export const saveToLocalStorage = (cart: CartState) => {
    if (typeof window !== "undefined") { 
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };
  
  
  export const loadFromLocalStorage = (): CartState => {
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
  
 
  