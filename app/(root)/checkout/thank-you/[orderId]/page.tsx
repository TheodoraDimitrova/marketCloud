"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchOrder } from "@/store/slices/orderSlice";
import { setCartFromOrder, clearCart } from "@/store/slices/cartSlice";
import { useParams } from "next/navigation";
import Loading from "@/components/shared/Loading";
import OrderSummary from "@/components//checkoutPage/OrderSummary";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Order } from "@/types/order";
import { clearOrder } from "@/store/slices/orderSlice";

const ThankYouPage = () => {
  const order = useSelector(
    (state: RootState) => state.order.order as Order | null
  );
  const status = useSelector((state: RootState) => state.order.status);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string | undefined;

  useEffect(() => {
    if (!order && orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [orderId, order, dispatch]);
  useEffect(() => {
    if (status === "succeeded" && order) {
      dispatch(setCartFromOrder(order));
      localStorage.removeItem("cart");
    }
  }, [status, order, dispatch]);

  const handleRedirect = () => {
    dispatch(clearOrder());
    dispatch(clearCart());
    router.push("/products");
  };

  if (status === "loading") return <Loading />;
  if (status === "failed") return <p>Error loading order.</p>;
  if (!order) return <Loading />;

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
        <div
          onClick={handleRedirect}
          className="cursor-pointer text-accent hover:underline"
        >
          Continue Shopping
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
