import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createOrder } from "@/store/slices/orderSlice";
import { prepareOrderData } from "@/lib/services/orderService";
import { FormValues } from "@/types/formValues";
import { CartState } from "@/types/cart";
import { useCallback } from "react";

interface UseCheckoutReturn {
  error: string | null;
  isSuccess: boolean;
  cart: CartState;
  orderStatus: "idle" | "loading" | "succeeded" | "failed";

  submitOrder: (formData: FormValues) => Promise<void>;
}

export const useCheckout = (): UseCheckoutReturn => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);
  const orderStatus: "idle" | "loading" | "succeeded" | "failed" =
    useAppSelector((state) => state.order?.status || "idle");
  const orderError = useAppSelector((state) => state.order?.error || null);

  const submitOrder = useCallback(
    async (data: FormValues) => {
      const orderData = prepareOrderData(data, cart);
      const result = await dispatch(createOrder(orderData));

      if (createOrder.rejected.match(result)) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [cart, dispatch]
  );

  return {
    error: orderError,
    isSuccess: orderStatus === "succeeded",
    cart,
    orderStatus,
    submitOrder,
  };
};
