"use client";

import OrderSummary from "@/components/features/checkout/OrderSummary";
import CheckoutForm from "@/components/features/checkout/CheckoutForm";
import { useCheckout } from "@/hooks/useCheckout";
import { Loading } from "@/components/ui/Loading";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { isLoading } = useCheckout();
  const orderStatus = useAppSelector((state) => state.order?.status || "idle");
  const order = useAppSelector((state) => state.order.order);
  const cartItems = useAppSelector((state) => state.cart.items);
  const router = useRouter();

  useEffect(() => {
    if (orderStatus === "succeeded" && order?._id) {
      localStorage.clear();
      router.push(`/checkout/thank-you/${order._id}`);
    }
  }, [orderStatus, order?._id, router]);

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems.length, router]);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 md:gap-4 my-10 md:my-24">
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center pointer-events-auto">
          <Loading />
        </div>
      )}
      <CheckoutForm />
      <OrderSummary />
    </div>
  );
};

export default CheckoutPage;
