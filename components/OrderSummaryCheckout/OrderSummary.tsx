"use client";
import React, { useEffect, useState } from "react";
import CartProductSummary from "../shared/CartProductSummary/CartProductSummary";
import { Tags } from "lucide-react";
import {
  calculateDiscountedPrice,
  calculateTotalSavings,
  calculateSubtotal,
} from "@/lib/calculateCheckout";

const OrderSummary = ({
  cartItems,
  shippingFee,
  onUpdateOrderData: onUpdateOrderData = () => {},
}) => {
  const subtotal = calculateSubtotal(cartItems);
  const effectiveShippingFee = subtotal >= 60 ? 0 : shippingFee;
  const totalSavings = calculateTotalSavings(cartItems);
  const totalAmount = subtotal + effectiveShippingFee;
  useEffect(() => {
    onUpdateOrderData?.({
      subtotal,
      shippingFee,
      totalAmount,
      totalSavings,
      shippingFee,
    });
  }, [shippingFee]);

  return (
    <div className="md:col-span-1 p-2 sm:p-4 md:p-6 bg-gray-100 rounded-md shadow-md min-w-[280px]">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <CartProductSummary item={item} />
            <div className="flex flex-col">
              {item.discount?.isActive && (
                <p className="text-sm text-gray-500 line-through decoration-2">
                  €{(item.price * item.quantity).toFixed(2)}
                </p>
              )}
              <p className="text-sm font-semibold">
                €{calculateDiscountedPrice(item).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </ul>

      {/* Subtotal */}
      <div className="flex justify-between mt-4 text-sm">
        <span>Subtotal:</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping Fee */}
      <div className="flex justify-between mt-0 text-sm">
        <span>Shipping Fee:</span>

        {subtotal >= 60 ? (
          <span>Free</span>
        ) : (
          <span>€{effectiveShippingFee.toFixed(2)}</span>
        )}
      </div>

      {/* Total Amount */}
      <div className="flex justify-between font-semibold text-lg mt-4">
        <span>Total Amount:</span>
        <span>€{totalAmount.toFixed(2)}</span>
      </div>

      {/* Total Savings */}
      {totalSavings > 0 && (
        <div className="flex my-4 ">
          <Tags />
          <p className="text-sm uppercase font-semibold">
            Total Savings <span> €{totalSavings.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
