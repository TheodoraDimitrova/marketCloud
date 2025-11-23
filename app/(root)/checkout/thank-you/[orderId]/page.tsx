"use client";

import { useEffect } from "react";
import { fetchOrder } from "@/store/slices/orderSlice";
import { setCartFromOrder, clearCart } from "@/store/slices/cartSlice";
import { useParams } from "next/navigation";
import Loading from "@/components/ui/Loading";
import OrderSummary from "@/components/features/checkout/OrderSummary";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { clearOrder } from "@/store/slices/orderSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { Button } from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

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
    if (status === "succeeded" && order?._id) {
      dispatch(setCartFromOrder(order));
      localStorage.removeItem("cart");
    }
  }, [status, order, dispatch]);

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
    <div className="max-w-4xl mx-auto p-6 text-gray-700">
      <h1 className="text-2xl font-semibold text-center">
        Thank You, {order.firstName}!
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Your order <strong>#{order._id}</strong> has been successfully placed.
      </p>

      {/*order status*/}
      <div className="mt-6 text-center">
        <p className="text-lg uppercase">
          Order Status: <strong>{order.status}</strong>
        </p>
        <p className="text-sm text-gray-500">
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
      <div className="mt-8">
        <OrderSummary />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3>Shipping Information</h3>
        <p>
          {order.firstName} {order.lastName}
        </p>
        <p>Phone : {order.phone}</p>
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

      <div className="mt-8 text-center">
        <Button onClick={handleRedirect} variant="default" size="lg">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default ThankYouPage;
