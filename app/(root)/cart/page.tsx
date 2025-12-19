"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import QuantitySelector from "@/components/shared/common/QuantitySelector";
import CartProductSummary from "@/components/features/products/CartProductSummary";
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
          <h1>Your Cart</h1>
          <FreeShippingBanner totalAmount={subtotal} />

          {/* Header of the list products */}
          <div className="hidden md:block w-full p-4 rounded-lg ">
            <div className="flex-between text-sm md:text-lg text-gray-700 font-medium">
              <div className="flex-1 text-left ">Product</div>
              <div className="w-32 text-center">Price</div>
              <div className="w-32 text-center ">Quantity</div>
              <div className="w-32 text-right ">Subtotal</div>
            </div>
          </div>

          {cartItems
            .filter((item): item is CartItem & { _id: string } => !!item._id) // Type guard
            .map((item) => (
              <div key={item._id} className="md:p-4 flex-col pb-4 mt-4">
                <div className="flex-between">
                  <div className="flex md:flex-1 flex-2 flex-col">
                    <CartProductSummary item={item} />
                    <div className="quantity md:hidden flex w-24 ml-20">
                      <QuantitySelector
                        updateQuantity={(quantity) =>
                          updateQuantity(item._id, quantity)
                        }
                        quantity={item.quantity}
                      />
                    </div>
                  </div>

                  <div className="single-price hidden md:block w-32 text-center">
                    <CartItemPrice item={item} className="text-center" />
                  </div>

                  <div className="quantity hidden md:flex md:flex-col md:text-center md:flex-center md:w-32 ">
                    <QuantitySelector
                      updateQuantity={(change) =>
                        updateQuantity(item._id, change)
                      }
                      quantity={item.quantity}
                    />

                    <div
                      onClick={() => {
                        dispatch(removeFromCart(item._id)); // Type guard
                      }}
                      className="text-center cursor-pointer text-red-500"
                    >
                      <p className="text-sm ">Remove</p>
                    </div>
                  </div>

                  <div className="subtotal w-32 text-right">
                    <p className="text-sm font-semibold">
                      <PriceDisplay
                        price={item.subtotalSingleProduct || item.price}
                      />
                    </p>
                  </div>
                </div>
              </div>
            ))}

          <div className="p-4 border-t border-grey-200">
            <div className="flex space-x-2 font-semibold text-lg w-full  justify-end">
              <span>Subtotal:</span>
              <span>
                <PriceDisplay price={subtotal} />
              </span>
            </div>

            <p className="pt-4 text-sm text-gray-500 flex w-full justify-end">
              Tax included, shipping and discounts calculated at checkout.
            </p>

            <div className="bg-black uppercase flex justify-center text-white py-2 mt-3 rounded-md md:w-[360px] ml-auto">
              <Link href="/checkout" className="m-auto text-center w-full">
                Proceed to Checkout
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
