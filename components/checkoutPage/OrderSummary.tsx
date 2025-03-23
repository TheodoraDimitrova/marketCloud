"use client";

import CartProductSummary from "../shared/CartProductSummary";
import { Tags } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Loading from "../shared/Loading";
import { CartItem } from "@/types/cart";

const OrderSummary = () => {
  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);
  const shipping = useSelector((state: RootState) => state.cart.shipping);
  const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const totalSavings = useSelector(
    (state: RootState) => state.cart.totalSavings
  );

  if (!cartItems || !subtotal || !shipping || !totalAmount) {
    return <Loading />;
  }

  const effectiveShippingFee = subtotal >= 60 ? 0 : shipping.cost;

  return (
    <div className="md:col-span-1 p-2 sm:p-4 md:p-6 bg-gray-100 rounded-md shadow-md min-w-[280px]">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <ul className="space-y-4">
        {cartItems.map((item, index) => (
          <li
            key={item._id || index}
            className="flex items-center justify-between"
          >
            <CartProductSummary item={item} />
            {item.discount?.isActive ? (
              <div className="flex flex-col">
                <p className="text-sm  line-through">
                  €{item.price.toFixed(2)}
                </p>
                <p className="text-sm font-semibold ">
                  €
                  {item.discountedPrice
                    ? item.discountedPrice.toFixed(2)
                    : item.price.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold">€{item.price.toFixed(2)}</p>
            )}
          </li>
        ))}
      </ul>

      {/* Subtotal */}
      <div className="flex justify-between mt-4 text-sm">
        <span>Subtotal:</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping Fee */}
      <div className="flex justify-between mt-0 text-sm">
        <span>Shipping Fее:</span>

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
