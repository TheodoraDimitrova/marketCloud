"use client";
import { useState } from "react";
import { X, Trash, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import QuantitySelector from "@/components/shared/cartDrawer/QuantitySelector";
import { Progress } from "@/components/ui/progress";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bestswimwear - Sunsets Black Wild Thing Bottom",
      description: "Wild Thing Bottom",
      color: "Black",
      size: "S",
      price: 50.0,
      image: "/images/img1.png",
      quantity: 1,
    },
    {
      id: 2,
      name: "Bestswimwear - Sunsets Blue Wild Thing Bottom",
      description: "Wild Thing Bottom",
      color: "Blue",
      size: "M",
      price: 45.0,
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

  const shippingCost = totalAmount >= freeShippingThreshold ? 0 : 5;
  const totalCost = totalAmount + shippingCost;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-semibold">Your Cart</h1>

      {/* Cart Content */}
      {cartItems.length > 0 ? (
        <>
          <div className="text-center mt-4">
            <p className="text-sm">
              {totalAmount >= freeShippingThreshold
                ? "You qualify for free shipping! 🎉"
                : `Spend £${(freeShippingThreshold - totalAmount).toFixed(
                    2
                  )} more for free shipping!`}
            </p>
            <Progress value={progress} className="w-full mt-2 h-2" />
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="md:p-4 flex-col pb-4 mt-4">
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
                  <p className="text-sm">{item.description}</p>
                  <p className="text-sm font-semibold">Color: {item.color}</p>
                  <p className="text-sm font-semibold">Size: {item.size}</p>
                  <p className="text-sm font-semibold">
                    £{item.price.toFixed(2)}
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
            {/* Subtotal */}
            <div className="flex space-x-2 font-semibold text-lg w-full  justify-end">
              <span>Subtotal:</span>
              <span>£{totalAmount.toFixed(2)}</span>
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
      )}
    </div>
  );
};

export default CartPage;
