"use client";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import QuantitySelector from "@/components/shared/QuantitySelector";
import CartProductSummary from "@/components/shared/CartProductSummary";
import FreeShippingBanner from "@/components/shared/FreeShippingBanner";
import EmptyShopingCard from "@/components/cartDrawer/EmptyShoppingCart";
import { updateItemQuantity, removeFromCart } from "@/store/slices/cartSlice";

const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);
  const dispatch = useDispatch();

  const updateQuantity = (id: string | undefined, change: number) => {
    if (id) {
      dispatch(updateItemQuantity({ id, quantity: change }));
    }
  };

  return (
    <div className="container max-w-3xl m-auto p-4 my-20">
      {cartItems.length > 0 ? (
        <>
          <h1 className="title ">Your Cart</h1>
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

          {cartItems.map((item) => (
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

                <div className="single-price hidden md:block w-32 text-center ">
                  {item.discount ? (
                    <>
                      <p className="text-sm font-semibold line-through">
                        €{item.price.toFixed(2)}
                      </p>
                      <p className="text-sm font-semibold">
                        €{item.discountedPrice?.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold">
                      €{item.price.toFixed(2)}
                    </p>
                  )}
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
                      if (item._id) {
                        dispatch(removeFromCart(item._id));
                      } else {
                        console.error("Product ID is missing.");
                      }
                    }}
                    className="text-center cursor-pointer text-red-500 underline"
                  >
                    <p className="text-sm ">Remove</p>
                  </div>
                </div>

                <div className="subtotal w-32 text-right">
                  <p className="text-sm font-semibold">
                    €
                    {item.subtotalSingleProduct?.toFixed(2) ??
                      item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 border-t border-grey-200">
            <div className="flex space-x-2 font-semibold text-lg w-full  justify-end">
              <span>Subtotal:</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>

            <p className="pt-4 text-sm text-gray-500 flex w-full justify-end">
              Tax included, shipping and discounts calculated at checkout.
            </p>

            <div className="bg-black uppercase flex justify-center text-white py-2 mt-3 rounded-md md:w-[360px] ml-auto">
              <Link href="/checkout" className="m-auto text-center w-full">
                Proceed to Checkout
              </Link>
            </div>

            {/* <Link
              href="/shop"
              className="underline text-red-500 w-full flex justify-end my-4"
            >
              <p>Continue Shopping</p>
            </Link> */}
          </div>
        </>
      ) : (
        <EmptyShopingCard />
      )}
    </div>
  );
};

export default CartPage;
