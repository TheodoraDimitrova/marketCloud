"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartProductSummary from "../CartProductSummary/CartProductSummary";
import FreeShippingBanner from "../FreeShippingBanner/FreeShippingBanner";
import EmptyShopingCard from "../EmptyShopingCard/EmptyShopingCard";
import QuantitySelector from "@/components/shared/quantitySelector/QuantitySelector";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  setIsCartOpen,
}) => {
  //   const [cartItems, setCartItems] = useState([]);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Adora Red Essence",
      description: "Lipstick",
      color: "Red",
      price: 50,
      image: "/images/img2.png",
      quantity: 1,
    },

    {
      id: 2,
      name: "Glow Highlighter",
      description: "Highlighter",
      color: "Red",
      price: 45,
      image: "/images/img1.png",
      quantity: 1,
    },
    {
      id: 3,
      name: " Linpstick",
      description: "Lipstick",
      color: "Red",
      price: 45,
      image: "/images/img4.png",
      quantity: 1,
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

  const pathname = usePathname();
  if (pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-3/4 max-w-sm p-4 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out text-gray-600 z-50 overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center p-4">
          {cartItems.length > 0 && <p>Your cart ({cartItems.length})</p>}
          <X size={24} onClick={onClose} className="ml-auto cursor-pointer" />
        </div>

        {cartItems.length === 0 ? (
          <EmptyShopingCard />
        ) : (
          <>
            <FreeShippingBanner totalAmount={totalAmount} />
            {/* Cart Content */}
            {cartItems.map((item) => (
              <div key={item.id} className="md:p-4  flex-col pb-4 mt-4 ">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <CartProductSummary item={item} />

                    <div className="ml-20 w-full">
                      <QuantitySelector
                        updateQuantity={(change) =>
                          updateQuantity(item.id, change)
                        }
                        quantity={item.quantity}
                      />
                    </div>
                  </div>

                  <div onClick={() => removeItem(item.id)}>
                    <p className="text-sm font-semibold">
                      {" "}
                      €{item.price.toFixed(2)}
                    </p>
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
    </>
  );
};

export default CartDrawer;
