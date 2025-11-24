"use client";

import OrderSummary from "@/components/features/checkout/OrderSummary";
import CheckoutForm from "@/components/features/checkout/CheckoutForm";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/Loading";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const [isClient, setIsClient] = useState(false);
  const orderStatus = useAppSelector((state) => state.order?.status || "idle");
  const order = useAppSelector((state) => state.order.order);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (orderStatus === "succeeded" && order?._id) {
      localStorage.clear();
      router.push(`/checkout/thank-you/${order._id}`);
    }
  }, [orderStatus, order?._id, router]);

  if (!isClient) {
    return <Loading />;
  }
  if (orderStatus === "succeeded") {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 md:gap-4 my-10 md:my-24">
      <CheckoutForm />
      {orderStatus !== "loading" && <OrderSummary />}
    </div>
  );
};

export default CheckoutPage;
