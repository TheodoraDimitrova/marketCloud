"use client";
import Link from "next/link";
import OrderSummary from "@/components/OrderSummaryCheckout/OrderSummary";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { format } from "date-fns";
import { useEffect } from "react";
import Loading from "@/components/shared/loading/loading";
import { fetchOrder } from "@/store/slices/orderSlice";
import { useParams } from "next/navigation";
import { setCartFromOrder } from "@/store/slices/cartSlice";

const ThankYouPage = () => {
  const { order, status } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();
  const { orderId } = useParams();

  useEffect(() => {
    if (!order && orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [orderId, order, dispatch]);
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(setCartFromOrder(order));
    }
  }, [status, order, dispatch]);

  if (status === "loading") return <Loading />;
  if (status === "failed") return <p>Error loading order.</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-700">
      {/* Заглавие */}
      <h1 className="text-2xl font-semibold text-center">
        Thank You, {order.firstName}!
      </h1>
      <p className="mt-2 text-center text-gray-600">
        Your order <strong>#{order._id}</strong> has been successfully placed.
      </p>

      {/* Поръчка ID и статус */}
      <div className="mt-6 text-center">
        <p className="text-lg uppercase">
          Order Status: <strong>{order.status}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Expected Delivery: {format(new Date(order._updatedAt), "yyyy-MM-dd")}
        </p>
      </div>
      <div className="mt-8">
        <OrderSummary />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold">Shipping Information</h2>
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
        <Link href="/products" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
