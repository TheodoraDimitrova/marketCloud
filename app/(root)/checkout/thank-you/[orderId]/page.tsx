"use client";

import { useEffect } from "react";
import { fetchOrder } from "@/store/slices/orderSlice";
import { setCartFromOrder, clearCart } from "@/store/slices/cartSlice";
import { useParams } from "next/navigation";
import { Loading } from "@/components/ui/Loading";
import OrderSummary from "@/components/features/checkout/OrderSummary";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types/order";
import { clearOrder } from "@/store/slices/orderSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

const ThankYouPage = () => {
  const order = useAppSelector((state) => state.order.order as Order | null);
  const orderError = useAppSelector((state) => state.order?.error || null);
  const status = useAppSelector((state) => state.order.status);
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string | undefined;
  const hasMatchingOrder = order?._id === orderId;

  useEffect(() => {
    if (orderId && (!order || order._id !== orderId)) {
      dispatch(fetchOrder(orderId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (
      status === "succeeded" &&
      order?._id &&
      orderId &&
      order._id === orderId
    ) {
      dispatch(
        setCartFromOrder({
          cart: order.cart,
          shipping: order.shipping,
          totalAmount: order.totalAmount,
          totalSavings: order.totalSavings,
        })
      );
    }
  }, [status, order, orderId, dispatch]);

  const handleRedirect = () => {
    dispatch(clearOrder());
    dispatch(clearCart());
    router.push("/products");
  };
  const handleRetry = () => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  };

  if (!hasMatchingOrder || !order) {
    if (status === "loading") {
      return <Loading />;
    }
    if (status === "failed") {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <ErrorMessage
            message={
              orderError || "Failed to load order details. Please try again."
            }
            retry={handleRetry}
          />
          <div className="mt-4 text-center">
            <Button onClick={() => router.push("/products")} variant="outline">
              Return to Products
            </Button>
          </div>
        </div>
      );
    }
    return <Loading />;
  }

  // Order is guaranteed to exist at this point
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-6 py-6 my-10 md:my-24">
      <div className="flex flex-col md:flex-row md:items-start">
        {/* Left Column - Main Content */}
        <div className="flex-1 md:mr-5 min-w-0 text-gray-700 space-y-6">
          <div className="text-center md:text-left">
            <h1>
              Thank You, {order.firstName}!
            </h1>
            <p className="mt-2 text-gray-600">
              Your order <strong>#{order._id}</strong> has been successfully placed.
            </p>
          </div>

          {/* Order Status */}
          <div className="text-center md:text-left">
            <p className="text-lg uppercase">
              Order Status: <strong>{order.status}</strong>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {order._updatedAt ? (
                <span>
                  Expected Delivery:{" "}
                  {format(new Date(order._updatedAt), "yyyy-MM-dd")}
                </span>
              ) : (
                <span>Expected Delivery: Date not available</span>
              )}
            </p>
          </div>

          {/* Shipping Information */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="mb-4">Shipping Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                {order.firstName} {order.lastName}
              </p>
              <p>Phone: {order.phone}</p>
              <p>
                {order.address}, {order.city}, {order.country}
              </p>
              <p>Postal Code: {order.postalCode}</p>
              <p>
                Delivery Method: <strong>{order.shipping.label}</strong>
              </p>
              <p>
                Payment Method: <strong>{order.paymentMethod}</strong>
              </p>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="text-center md:text-left">
            <Button onClick={handleRedirect} variant="default" size="lg">
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="w-full md:w-[300px] lg:w-[380px] md:flex-shrink-0 mt-8 md:mt-0">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
