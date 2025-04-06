"use client";

import OrderSummary from "@/components/checkoutPage/OrderSummary";
import CheckoutForm from "@/components/checkoutPage/CheckoutForm";
import { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";

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
