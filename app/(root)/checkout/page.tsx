"use client";
import { useState } from "react";
import OrderSummary from "@/components/OrderSummaryCheckout/OrderSummary";
import CheckoutForm from "@/components/CheckoutForm/CheckoutForm";
import { calculateShippingFee } from "@/lib/calculateCheckout";

const CheckoutPage = () => {
  const [deliveryMethod, setDeliveryMethod] = useState<string>("");
  const [summaryData, setSummaryData] = useState({});

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Adora Red Essence",
      description: "Lipstick",
      color: "Red",
      price: 50,
      image: "/images/img1.png",
      quantity: 1,
      discount: {
        amount: 10,
        type: "percentage",
        isActive: true,
      },
    },
    {
      id: 2,
      name: "Adora Rose Glow Highlighter",
      description: "Lipstick",
      color: "Red",
      price: 10,
      image: "/images/img2.png",
      quantity: 2,
      discount: {
        amount: 5,
        type: "fixed",
        isActive: true,
      },
    },
    {
      id: 3,
      name: "Glow Highlighter",
      description: "Highlighter",
      color: "Red",
      price: 25,
      image: "/images/img3.png",
      quantity: 2,
      discount: {
        amount: 20,
        type: "percentage",
        isActive: true,
      },
    },
  ]);

  const handleFormSubmit = (orderData) => {
    console.log("Form data", {
      ...orderData,
      deliveryMethod,
      cartItems,
      summaryData,
    });
  };
  const handleUpdateOrderData = (data) => {
    setSummaryData(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-10 md:my-24">
      <CheckoutForm
        handleFormSubmit={handleFormSubmit}
        handleDeliveryMethodChange={setDeliveryMethod}
      />
      <OrderSummary
        cartItems={cartItems}
        shippingFee={calculateShippingFee(deliveryMethod, summaryData.subtotal)}
        onUpdateOrderData={handleUpdateOrderData}
      />
    </div>
  );
};

export default CheckoutPage;
