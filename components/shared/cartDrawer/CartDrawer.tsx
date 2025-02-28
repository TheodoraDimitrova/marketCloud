"use client";

import { useState } from "react";
import { X, Trash, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import QuantitySelector from "./QuantitySelector";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  //   const [cartItems, setCartItems] = useState([]);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Zoe Bralette",
      price: 23.9,
      image: "/images/img1.png",
      quantity: 1,
    },
    {
      id: 2,
      name: "Zoe Bralette",
      price: 12.9,
      image: "/images/img2.png",
      quantity: 2,
    },
  ]);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const freeShippingThreshold = 60;
  const progress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    // console.log("updateQuantity", id, change);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(item.quantity + change, 500)),
            }
          : item
      )
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen w-3/4 max-w-sm p-4 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out text-gray-600 z-50`}
    >
      {/* Header */}
      <div className="flex items-center p-4">
        {cartItems.length > 0 && <p>Your cart ({cartItems.length})</p>}

        <X size={24} onClick={onClose} className="ml-auto" />
      </div>

      {cartItems.length > 0 && (
        <div className="text-center">
          <p className="text-sm">
            {totalAmount >= freeShippingThreshold
              ? "You qualify for free shipping! 🎉"
              : `Spend €${(freeShippingThreshold - totalAmount).toFixed(
                  2
                )} more for free shipping!`}
          </p>
          <Progress value={progress} className="w-full mt-2 h-2" />
        </div>
      )}

      {/* If the cart is empty */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center px-6 md:px-8">
          <ShoppingCart size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <p className="text-gray-500 mb-4">
            Discover our new arrivals and bestsellers!
          </p>
          <Link href="/shop">
            <button className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Content */}
          {cartItems.map((item) => (
            <div key={item.id} className="md:p-4  flex-col pb-4 mt-4 ">
              <div className="flex items-center justify-between">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50px, 100px"
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1 ml-3 flex flex-col">
                  <h3 className="text-sm font-medium">{item.name}</h3>

                  <p className="text-sm font-semibold">
                    {" "}
                    €{item.price.toFixed(2)}
                  </p>
                  <QuantitySelector
                    updateQuantity={(quantity) =>
                      updateQuantity(item.id, quantity)
                    }
                    quantity={item.quantity}
                  />
                </div>

                <div
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 h-20 flex items-start"
                >
                  <Trash size={20} />
                </div>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Subtotal:</span>
              <span>
                &euro;
                {totalAmount.toFixed(2)}
              </span>
            </div>
            <p className="py-4">
              Tax included, shipping and discounts calculated at checkout.
            </p>
            <Button asChild className="w-60">
              <Link
                href="/cart"
                className="w-full bg-black text-white py-2 mt-3 rounded-md"
              >
                Checkout
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDrawer;
