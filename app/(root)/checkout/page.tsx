"use client";

import OrderSummary from "@/components/features/checkout/OrderSummary";
import CheckoutForm from "@/components/features/checkout/CheckoutForm";
import { Loading } from "@/components/ui/Loading";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/slices/cartSlice";
import { clearOrder } from "@/store/slices/orderSlice";

const CheckoutPage = () => {
  const orderStatus = useAppSelector((state) => state.order?.status || "idle");
  const order = useAppSelector((state) => state.order.order);
  const cartItems = useAppSelector((state) => state.cart.items);
  const orderError = useAppSelector((state) => state.order?.error || null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (orderStatus === "succeeded" && order?._id) {
      dispatch(clearCart());
      router.push(`/checkout/thank-you/${order._id}`);
    }
  }, [orderStatus, order?._id, router, dispatch]);

  // Redirect to cart if cart is empty (but not if order is being processed)
  useEffect(() => {
    if (
      cartItems.length === 0 &&
      orderStatus !== "succeeded" &&
      orderStatus !== "loading"
    ) {
      router.push("/cart");
    }
  }, [cartItems.length, orderStatus, router]);

  const showLoading =
    orderStatus === "loading" || (orderStatus === "succeeded" && order?._id);

  const handleRetry = () => {
    dispatch(clearOrder());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 md:gap-4 my-10 md:my-24">
      {showLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
          <Loading />
        </div>
      )}
      {orderError && (
        <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-auto">
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 max-w-md mx-4">
            <ErrorMessage message={orderError} retry={handleRetry} />
          </div>
        </div>
      )}
      <CheckoutForm />
      <OrderSummary />
    </div>
  );
};

export default CheckoutPage;
