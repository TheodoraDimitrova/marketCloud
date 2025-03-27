"use client";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartProductSummary from "../shared/CartProductSummary";
import FreeShippingBanner from "../shared/FreeShippingBanner";
import EmptyShopingCard from "./EmptyShoppingCart";
import QuantitySelector from "@/components/shared/QuantitySelector";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { updateItemQuantity } from "@/store/slices/cartSlice";
import { useEffect } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const updateQuantity = (id: string | undefined, change: number) => {
    if (id) {
      dispatch(updateItemQuantity({ id, quantity: change }));
    }
  };

  const pathname = usePathname();
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
        <div className="flex items-center p-4">
          {cartItems.length > 0 && <p>Your cart ({cartItems.length})</p>}
          <X size={24} onClick={onClose} className="ml-auto cursor-pointer" />
        </div>

        {cartItems.length === 0 ? (
          <EmptyShopingCard />
        ) : (
          <>
            <FreeShippingBanner totalAmount={subtotal} />
            {/* Cart Content */}
            {cartItems.map((item, index) => (
              <div
                key={item._id || index}
                className="md:p-4  flex-col pb-4 mt-4 "
              >
                <div className="flex-between">
                  <div className="flex flex-col">
                    <CartProductSummary item={item} />

                    <div className="ml-20 w-full">
                      <QuantitySelector
                        updateQuantity={(change) =>
                          updateQuantity(item._id, change)
                        }
                        quantity={item.quantity}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {item.discount ? (
                      <>
                        <p className="text-sm font-semibold line-through">
                          €{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-semibold">
                          €{item.discountedPrice?.toFixed(2) ?? "0.00"}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold">
                        €{item.price.toFixed(2)}
                      </p>
                    )}
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
                  {subtotal.toFixed(2)}
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
