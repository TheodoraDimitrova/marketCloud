"use client";

import Link from "next/link";
import OrderSummary from "@/components/OrderSummaryCheckout/OrderSummary";

const ThankYouPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Adora Red Essence",
      description: "Lipstick",
      color: "Red",
      price: 50,
      image: "/images/img2.png",
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
  ];
  const orderResponse = {
    success: true,
    message: "Order successfully created",
    orderId: "123456789",
    createdAt: "2025-03-03T12:00:00Z",
    expectedDelivery: "2025-03-07",
    status: "confirmed",
    orderData: {
      firstName: "Teodora",
      lastName: "Dimitrova",
      contact: "teddytyyy@gmail.com",
      phone: "0879452007",
      address: "Gabrovo",
      city: "Gabrovo",
      country: "bg",
      postalCode: "3500",
      deliveryMethod: "toAddress",
      paymentMethod: "cod",
      cartItems: [
        { id: 1, name: "Adora Red Essence", price: 50, quantity: 1 },
        { id: 2, name: "Adora Rose Glow Highlighter", price: 10, quantity: 2 },
        { id: 3, name: "Glow Highlighter", price: 25, quantity: 2 },
      ],
      summaryData: {
        shippingFee: "Free",
        subtotal: 95,
        totalAmount: 95,
        totalSavings: 25,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-700">
      {/* Заглавие */}
      <h1 className="text-2xl font-semibold text-center">
        Thank You, {orderResponse.orderData.firstName}!
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Your order <strong>#{orderResponse.orderId}</strong> has been
        successfully placed.
      </p>

      {/* Поръчка ID и статус */}
      <div className="mt-6 text-center">
        <p className="text-lg">
          Order Status: <strong>{orderResponse.status}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Expected Delivery: {orderResponse.expectedDelivery}
        </p>
      </div>

      {/* Order Summary */}
      <div className="mt-8">
        <OrderSummary
          cartItems={cartItems}
          shippingFee={orderResponse.orderData.summaryData.shippingFee}
        />
      </div>

      {/* Адрес и метод на доставка */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
        <p>
          {orderResponse.orderData.firstName} {orderResponse.orderData.lastName}
        </p>
        <p>
          {orderResponse.orderData.address}, {orderResponse.orderData.city},{" "}
          {orderResponse.orderData.country}
        </p>
        <p>Postal Code: {orderResponse.orderData.postalCode}</p>
        <p>
          Delivery Method:{" "}
          <strong>{orderResponse.orderData.deliveryMethod}</strong>
        </p>
        <p>
          Payment Method:{" "}
          <strong>{orderResponse.orderData.paymentMethod.toUpperCase()}</strong>
        </p>
      </div>

      {/* Бутон за продължаване на пазаруването */}
      <div className="mt-8 text-center">
        <Link href="/shop" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
