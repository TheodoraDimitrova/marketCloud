"use client";
import { useState } from "react";
import Link from "next/link";

import QuantitySelector from "@/components/shared/cartDrawer/QuantitySelector";

import CartProductSummary from "@/components/shared/CartProductSummary/CartProductSummary";
import FreeShippingBanner from "@/components/shared/FreeShippingBanner/FreeShippingBanner";
import EmptyShopingCard from "@/components/shared/EmptyShopingCard/EmptyShopingCard";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Adora Red Essence ",
      description: "Lipstick",
      color: "Red",
      price: 50,
      image: "/images/img1.png",
      quantity: 1,
    },
    {
      id: 2,
      name: "Adora Rose Glow Highlighter",
      description: "Lipstick",
      color: "Red",
      price: 45,
      image: "/images/img2.png",
      quantity: 2,
    },
  ]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="container max-w-3xl m-auto p-4 my-20">
      {/* Cart Content */}
      {cartItems.length > 0 ? (
        <>
          <h1 className="title ">Your Cart</h1>
          <FreeShippingBanner totalAmount={totalAmount} />

          {/* Header of the list products */}
          <div className="hidden md:block w-full p-4 rounded-lg ">
            <div className="flex items-center justify-between text-sm md:text-lg text-gray-700 font-medium">
              <div className="flex-1 text-left ">Product</div>
              <div className="w-32 text-center">Price</div>
              <div className="w-32 text-center ">Quantity</div>
              <div className="w-32 text-right ">Subtotal</div>
            </div>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="md:p-4 flex-col pb-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 flex-col">
                  <CartProductSummary item={item} />
                  <div className="quantity md:hidden flex w-24 ml-20">
                    <QuantitySelector
                      updateQuantity={(quantity) =>
                        updateQuantity(item.id, quantity)
                      }
                      quantity={item.quantity}
                    />
                  </div>
                </div>

                <div className="single-price hidden md:block w-32 text-center ">
                  <p className="text-sm font-semibold">
                    £{item.price.toFixed(2)}
                  </p>
                </div>

                <div className="quantity hidden md:flex flex-col text-center justify-center items-center w-32">
                  <QuantitySelector
                    updateQuantity={(quantity) =>
                      updateQuantity(item.id, quantity)
                    }
                    quantity={item.quantity}
                  />

                  <div
                    onClick={() => removeItem(item.id)}
                    className="text-center cursor-pointer text-red-500 underline"
                  >
                    <p className="text-sm ">Remove</p>
                  </div>
                </div>

                <div className="subtotal w-32 text-right">
                  <p className="text-sm font-semibold">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 border-t border-grey-200">
            {/* Subtotal */}
            <div className="flex space-x-2 font-semibold text-lg w-full  justify-end">
              <span>Subtotal:</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>

            {/* Tax info */}
            <p className="pt-4 text-sm text-gray-500 flex w-full justify-end">
              Tax included, shipping and discounts calculated at checkout.
            </p>

            {/* Proceed to checkout button */}
            <div className="bg-black uppercase flex justify-center text-white py-2 mt-3 rounded-md md:w-[360px] ml-auto">
              <Link href="/checkout" className="m-auto text-center w-full">
                Proceed to Checkout
              </Link>
            </div>
            {/* Continue shopping link */}
            <Link
              href="/shop"
              className="underline text-red-500 w-full flex justify-end"
            >
              <p>Continue Shopping</p>
            </Link>
          </div>
        </>
      ) : (
        <EmptyShopingCard />
      )}
    </div>
  );
};

export default CartPage;
