"use client";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import FreeShippingBanner from "@/components/features/cart/FreeShippingBanner";
import EmptyShoppingCart from "@/components/features/cart/EmptyShoppingCart";
import QuantitySelector from "@/components/shared/common/QuantitySelector";
import { updateItemQuantity } from "@/store/slices/cartSlice";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import CartItemPrice from "@/components/shared/cart/CartItemPrice";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const cartItems = useAppSelector((state) => state.cart.items);
  const subtotal = useAppSelector((state) => state.cart.subtotal);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Close drawer when navigating to cart/checkout pages
    if ((pathname === "/cart" || pathname === "/checkout") && isOpen) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  // Use hook with disabled paths for cart/checkout pages
  useBodyScrollLock(isOpen, {
    disabledPaths: ["/cart", "/checkout"],
    currentPath: pathname,
  });

  const updateQuantity = (id: string | undefined, change: number) => {
    if (id) {
      dispatch(updateItemQuantity({ id, quantity: change }));
    }
  };

  if (pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-3/4 max-w-sm p-4 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out text-gray-600 z-20 overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isMounted && cartItems.length > 0
              ? `Your cart (${cartItems.length})`
              : "Your cart"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {!isMounted || cartItems.length === 0 ? (
          <EmptyShoppingCart />
        ) : (
          <>
            <FreeShippingBanner totalAmount={subtotal} />
            {/* Cart Content */}
            <div className="py-2">
              {cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="border-b border-gray-100 last:border-b-0 py-4 first:pt-2"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0 w-20 h-20">
                      <Image
                        src={urlFor(item.images[0])}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="rounded-md object-cover"
                        unoptimized={true}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h3>

                      {/* Price and Quantity Row */}
                      <div className="flex items-center justify-between mt-2 gap-3">
                        <QuantitySelector
                          updateQuantity={(change) =>
                            updateQuantity(item._id, change)
                          }
                          quantity={item.quantity}
                        />
                        <CartItemPrice item={item} />
                      </div>

                      {/* Discount Badge */}
                      {item.discount?.isActive && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-[#7d0d23] bg-[#7d0d23]/10 px-2 py-0.5 rounded">
                            -{item.discount.amount}
                            {item.discount.type === "percentage" ? "%" : "€"} OFF
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-base font-semibold text-gray-900">
                  Subtotal:
                </span>
                <PriceDisplay price={subtotal} className="text-lg font-bold text-gray-900" />
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Tax included, shipping and discounts calculated at checkout.
              </p>
              <Button asChild className="w-full" onClick={onClose}>
                <Link href="/cart" className="w-full text-center">
                  View Cart & Checkout
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
