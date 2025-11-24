import { FormValues } from "@/types/formValues";
import { CartItem, CartState } from "@/types/cart";
import { Order } from "@/types/order";

/**
 * Prepares order data by combining form values with cart information
 * @param data - Form values from the checkout form
 * @param cart - Current cart state
 * @returns Order object ready to be submitted
 */
export const prepareOrderData = (data: FormValues, cart: CartState): Order => {
  return {
    ...data,
    cart: cart.items.map((item: CartItem, index: number) => ({
      _key: `cartItem-${Date.now()}-${index}`,
      _type: "cartItem",
      images: [item.images[0]],
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      discountedPrice: item.discount ? item.discountedPrice : item.price,
      subtotalSingleProduct: item.subtotalSingleProduct,
      totalPrice: item.subtotalSingleProduct,
      discount: item.discount
        ? {
            amount: item.discount.amount,
            isActive: item.discount.isActive,
            type: item.discount.type,
          }
        : {
            amount: 0,
            isActive: false,
            type: "",
          },
    })),
    subtotal: cart.subtotal,
    totalSavings: cart.totalSavings,
    totalAmount: cart.totalAmount,
    shipping: {
      method: cart.shipping.method,
      cost: cart.shipping.cost,
      label: cart.shipping.label,
    },
    status: "confirm",
  };
};
