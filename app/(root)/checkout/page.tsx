"use client";

import OrderSummary from "@/components/features/checkout/OrderSummary";
import CheckoutForm from "@/components/features/checkout/CheckoutForm";
import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

const CheckoutPage = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <Loading />;
  }
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 md:gap-4 my-10 md:my-24">
      <CheckoutForm />
      <OrderSummary />
    </div>
  );
};

export default CheckoutPage;
