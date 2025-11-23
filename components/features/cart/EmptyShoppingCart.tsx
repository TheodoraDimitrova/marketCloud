import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const EmptyShoppingCart = () => {
  return (
    <div className="flex-center flex-col  h-full text-center px-6 md:px-8 md:py-12">
      <ShoppingCart size={48} className="text-gray-400 mb-4" />
      <h3>Your cart is empty</h3>
      <p className="text-gray-500 mb-4">
        Discover our new arrivals and best sellers!
      </p>
      <Link
        href="/products"
        className="inline-block bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  );
};

export default EmptyShoppingCart;
