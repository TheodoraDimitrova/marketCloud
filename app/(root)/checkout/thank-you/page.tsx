"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const Thank_youPage = () => {
  const [orderDetails, setOrderDetails] = useState({
    orderId: "12345",
    products: [
      {
        name: "Adora Red Essence",
        price: 50,
        quantity: 1,
      },
      {
        name: "Adora Red Ember",
        price: 45,
        quantity: 1,
      },
    ],
    totalAmount: 95,
    shippingAddress: "123 Example St, London, UK",
    deliveryMethod: "Standard",
    status: "Confirmed",
  });

  useEffect(() => {
    // Fetch order details from the server
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Your Order Has Been Confirmed!</h1>
      <p className="mt-4 text-lg text-gray-600">
        Order ID: {orderDetails.orderId}
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <ul className="mt-4 space-y-4">
          {orderDetails.products.map((product, index) => (
            <li key={index} className="flex justify-between">
              <span>
                {product.name} x{product.quantity}
              </span>
              <span>£{(product.price * product.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between font-semibold">
          <span>Total Amount</span>
          <span>£{orderDetails.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        <p className="text-gray-600">{orderDetails.shippingAddress}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Delevery Method</h2>
        <p className="text-gray-600">{orderDetails.deliveryMethod}</p>
      </div>

      <div className="mt-8">
        <p className="text-lg">
          Your order status is: <strong>{orderDetails.status}</strong>
        </p>
      </div>

      <div className="mt-8">
        <Link href="/shop" className="text-blue-500 underline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default Thank_youPage;
