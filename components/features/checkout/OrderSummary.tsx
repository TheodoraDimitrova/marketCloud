"use client";

import CartProductSummary from "@/components/features/products/CartProductSummary";
import { Tags } from "lucide-react";
import { Loading } from "@/components/ui/Loading";
import { CartItem } from "@/lib/types/cart";
import { useAppSelector } from "@/hooks/useAppSelector";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import CartItemPrice from "@/components/shared/cart/CartItemPrice";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { RefreshCw, Truck } from "lucide-react";
import { usePathname } from "next/navigation";

const OrderSummary = () => {
  const pathname = usePathname();
  const isThankYouPage = pathname?.includes("/checkout/thank-you");
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
    <div className={`w-full md:w-[300px] lg:w-[380px] bg-white rounded-lg shadow-lg border border-gray-200 mt-10 md:mt-0 h-fit ${!isThankYouPage ? "md:sticky md:top-24" : ""}`}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2>Order Summary</h2>
      </div>

      {/* Products List */}
      <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
        <ul className="space-y-4">
          {cartItems.map((item, index) => (
            <li key={item._id || index} className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <CartProductSummary item={item} />
              </div>
              <div className="flex-shrink-0">
                <CartItemPrice item={item} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing Summary */}
      <div className="px-6 py-4 border-t border-gray-200 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">Subtotal:</span>
          <PriceDisplay
            price={subtotal}
            className="text-base font-semibold text-gray-900"
          />
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">Shipping:</span>
          {subtotal >= FREE_SHIPPING_THRESHOLD ? (
            <span className="text-base font-semibold text-green-600">Free</span>
          ) : (
            <PriceDisplay
              price={effectiveShippingFee}
              className="text-base font-semibold text-gray-900"
            />
          )}
        </div>

        {/* Total Savings */}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between py-2 px-3 bg-[#7d0d23]/5 rounded-md border border-[#7d0d23]/20">
            <div className="flex items-center gap-2">
              <Tags className="text-[#7d0d23] w-4 h-4" />
              <span className="text-xs uppercase font-semibold text-[#7d0d23]">
                You Save
              </span>
            </div>
            <PriceDisplay price={totalSavings} className="text-sm font-semibold text-[#7d0d23]" />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3 mt-2">
          {/* Total Amount */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Total:</span>
            <PriceDisplay
              price={totalAmount}
              className="text-base font-semibold text-gray-900"
            />
          </div>
        </div>

        {/* Trust Signals - In Order Summary (Secondary, Minimal) */}
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {subtotal >= FREE_SHIPPING_THRESHOLD && (
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck className="w-3.5 h-3.5 text-green-600" />
              <span>Free Shipping</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
