"use client";

import CartProductSummary from "@/components/features/products/CartProductSummary";
import { Tags } from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import { CartItem } from "@/lib/types/cart";
import { useAppSelector } from "@/hooks/useAppSelector";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import CartItemPrice from "@/components/shared/cart/CartItemPrice";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

const OrderSummary = () => {
  const cartItems: CartItem[] = useAppSelector((state) => state.cart.items);
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const shipping = useAppSelector((state) => state.cart.shipping);
  const totalAmount = useAppSelector((state) => state.cart.totalAmount);
  const totalSavings = useAppSelector((state) => state.cart.totalSavings);

  if (!cartItems || !subtotal || !shipping || !totalAmount) {
    return <Loading />;
  }

  const effectiveShippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : shipping.cost;

  return (
    <div className=" md:min-w-[280px] md:w-auto p-2 sm:p-4 md:p-6 bg-gray-100 rounded-md shadow-md mt-10 md:mt-0">
      <h2>Order Summary</h2>
      <ul className="space-y-4">
        {cartItems.map((item, index) => (
          <li key={item._id || index} className="flex-between">
            <CartProductSummary item={item} />
            <CartItemPrice item={item} />
          </li>
        ))}
      </ul>

      {/* Subtotal */}
      <div className="flex justify-between mt-4 text-sm">
        <span>Subtotal:</span>
        <span>
          <PriceDisplay price={subtotal} />
        </span>
      </div>

      {/* Shipping Fee */}
      <div className="flex justify-between mt-0 text-sm">
        <span>Shipping Fее:</span>

        {subtotal >= FREE_SHIPPING_THRESHOLD ? (
          <span>Free</span>
        ) : (
          <span>
            <PriceDisplay price={effectiveShippingFee} />
          </span>
        )}
      </div>

      {/* Total Amount */}
      <div className="flex justify-between font-semibold text-lg mt-4">
        <span>Total Amount:</span>
        <span>
          <PriceDisplay price={totalAmount} />
        </span>
      </div>

      {/* Total Savings */}
      {totalSavings > 0 && (
        <div className="flex items-center justify-between my-4 p-3 bg-[#7d0d23]/10 rounded-md border border-[#7d0d23]/20">
          <div className="flex items-center gap-2">
            <Tags className="text-[#7d0d23] w-5 h-5" />
            <span className="text-sm uppercase font-semibold text-[#7d0d23]">
              Total Savings
            </span>
          </div>
          <PriceDisplay price={totalSavings} className="text-base font-bold text-[#7d0d23]" />
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
