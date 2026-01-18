"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import QuantitySelector from "@/components/shared/common/QuantitySelector";
import FreeShippingBanner from "@/components/features/cart/FreeShippingBanner";
import EmptyShoppingCart from "@/components/features/cart/EmptyShoppingCart";
import { updateItemQuantity, removeFromCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Loading } from "@/components/ui/Loading";
import { persistor } from "@/store/store";

import PriceDisplay from "@/components/shared/common/PriceDisplay";
import CartItemPrice from "@/components/shared/cart/CartItemPrice";
import { CartItem } from "@/lib/types/cart";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const dispatch = useAppDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && persistor) {
      const unsubscribe = persistor.subscribe(() => {
        setIsHydrated(true);
      });

      const checkState = persistor.getState();
      if (checkState && checkState.bootstrapped) {
        setIsHydrated(true);
      }

      const timeout = setTimeout(() => {
        setIsHydrated(true);
      }, 100);

      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } else {
      setIsHydrated(true);
    }
  }, []);

  const updateQuantity = (id: string | undefined, change: number) => {
    if (id) {
      dispatch(updateItemQuantity({ id, quantity: change }));
    }
  };

  if (!isHydrated) {
    return (
      <div className="container max-w-3xl m-auto p-4 my-20 flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl m-auto p-4 my-20">
      {cartItems.length > 0 ? (
        <>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Your Cart
          </h1>
          <FreeShippingBanner totalAmount={subtotal} />

          {/* Header of the list products */}
          <div className="hidden md:block w-full p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="flex-1 text-left text-sm font-medium text-gray-700">
                Product
              </div>
              <div className="w-24 text-center text-sm font-medium text-gray-700">
                Price
              </div>
              <div className="w-32 text-center text-sm font-medium text-gray-700">
                Quantity
              </div>
              <div className="w-24 text-right text-sm font-medium text-gray-700">
                Subtotal
              </div>
            </div>
          </div>

          {cartItems
            .filter((item): item is CartItem & { _id: string } => !!item._id) // Type guard
            .map((item) => (
              <div
                key={item._id}
                className="md:p-4 pb-6 pt-4 border-b border-gray-200"
              >
                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  {/* Product Image and Name */}
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0 w-24 h-24">
                      <Image
                        src={urlFor(item.images[0])}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="rounded-md object-cover"
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                        {item.name}
                      </h3>
                      {item.discount?.isActive && (
                        <span className="inline-block text-xs font-medium text-[#7d0d23] bg-[#7d0d23]/10 px-2 py-1 rounded mb-2">
                          -{item.discount.amount}
                          {item.discount.type === "percentage" ? "%" : "€"} OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-gray-600">Price:</span>
                    <CartItemPrice item={item} />
                  </div>

                  {/* Quantity Section */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <QuantitySelector
                      updateQuantity={(change) =>
                        updateQuantity(item._id, change)
                      }
                      quantity={item.quantity}
                    />
                  </div>

                  {/* Total Price Section */}
                  <div className="flex items-center justify-end pt-2">
                    <PriceDisplay
                      price={item.subtotalSingleProduct || item.price}
                      className="text-base font-semibold text-gray-900"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      dispatch(removeFromCart(item._id));
                    }}
                    className="w-full text-center text-sm text-[#7d0d23] hover:text-[#5a0919] transition-colors py-2 border border-[#7d0d23]/30 hover:border-[#7d0d23] rounded-md"
                  >
                    Remove
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex md:items-center md:gap-6">
                  {/* Product Image */}
                  <div className="relative flex-shrink-0 w-24 h-24">
                    <Image
                      src={urlFor(item.images[0])}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="rounded-xl object-cover"
                      unoptimized={true}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    {item.discount?.isActive && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-[#7d0d23] bg-[#7d0d23]/10 px-2 py-0.5 rounded">
                          -{item.discount.amount}
                          {item.discount.type === "percentage" ? "%" : "€"} OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="w-24 text-center">
                    <CartItemPrice item={item} className="text-center" />
                  </div>

                  {/* Quantity and Remove */}
                  <div className="w-32 flex flex-col items-center gap-2">
                    <QuantitySelector
                      updateQuantity={(change) =>
                        updateQuantity(item._id, change)
                      }
                      quantity={item.quantity}
                    />
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item._id));
                      }}
                      className="text-sm text-[#7d0d23] hover:text-[#5a0919] transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="w-24 text-right">
                    <PriceDisplay
                      price={item.subtotalSingleProduct || item.price}
                      className="text-base font-semibold text-gray-900"
                    />
                  </div>
                </div>
              </div>
            ))}

          <div className="p-4 mt-6">
            <div className="flex space-x-2 font-semibold text-base w-full  justify-end">
              <span>Subtotal:</span>
              <PriceDisplay
                price={subtotal}
                className="text-base font-semibold text-gray-900"
              />
            </div>

            <p className="pt-4 text-sm text-gray-500 flex w-full justify-end">
              Tax included, shipping and discounts calculated at checkout.
            </p>

            <div className="flex justify-end mt-4">
              <Link href="/checkout" className="w-full md:w-auto">
                <Button className="w-full md:w-[360px]">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <EmptyShoppingCart />
      )}
    </div>
  );
};

export default CartPage;
