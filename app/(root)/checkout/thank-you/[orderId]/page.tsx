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
import { MapPin, Phone, Truck, CreditCard, CheckCircle2, Mail, Clock, Shield, RefreshCw } from "lucide-react";

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
  // Format order ID to show only last 8 characters
  const formatOrderId = (id: string | undefined): string => {
    if (!id) return "";
    return id.length > 8 ? `#${id.slice(-8).toUpperCase()}` : `#${id.toUpperCase()}`;
  };

  // Calculate expected delivery date (3-5 business days from order date)
  const calculateExpectedDelivery = (): string => {
    if (!order._updatedAt) return "Date not available";
    const orderDate = new Date(order._updatedAt);
    // Add 4 business days (average)
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4);
    return format(deliveryDate, "MMMM dd, yyyy");
  };

  // Check if contact is an email
  const isEmail = (contact: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(contact);
  };

  const contactIsEmail = order.contact ? isEmail(order.contact) : false;

  return (
    <div className="container max-w-6xl mx-auto px-6 md:px-8 lg:px-6 py-6 my-10 md:my-24">
      <div className="flex flex-col md:flex-row md:items-start">
        {/* Left Column - Main Content */}
        <div className="flex-1 md:mr-5 min-w-0 text-gray-700 space-y-6">
          {/* Success Header with Icon */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1>
                  Thank You, {order.firstName}!
                </h1>
                <p className="text-sm text-gray-500 mt-1">Your order has been confirmed</p>
              </div>
            </div>
            <p className="mt-2 text-gray-600">
              Your order <strong className="text-gray-900">{formatOrderId(order._id)}</strong> has been successfully placed.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-5">
            <h3 className="mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              What&apos;s Next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>
                  {contactIsEmail ? (
                    <>You&apos;ll receive an email confirmation at <strong>{order.contact}</strong> within a few minutes</>
                  ) : (
                    <>You&apos;ll receive a confirmation message at <strong>{order.contact}</strong> within a few minutes</>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>We&apos;ll send you tracking information once your order ships</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Expected delivery: <strong>{calculateExpectedDelivery()}</strong></span>
              </li>
            </ul>
          </div>

          {/* Order Status */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Status</p>
                <p className="text-base font-semibold text-gray-900 capitalize">
                  {order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Expected Delivery</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {calculateExpectedDelivery()}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3>Shipping Information</h3>
            </div>
            <div className="p-6 space-y-4">
              {/* Name */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {order.firstName?.[0]?.toUpperCase() || ""}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-base font-medium text-gray-900">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Address</p>
                  <div className="text-sm text-gray-900 space-y-0.5">
                    <p className="font-medium">{order.address}</p>
                    <p>{order.city}, {order.postalCode}</p>
                    <p className="text-gray-600">{order.country.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">{order.phone}</p>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <Truck className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Delivery Method</p>
                  <p className="text-sm font-semibold text-gray-900">{order.shipping.label}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                <CreditCard className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Payment Method</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-5">
            <h3 className="mb-3 uppercase tracking-wide text-xs">Your Purchase is Protected</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                  <p className="text-xs text-gray-600">Your payment information is encrypted</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">30-Day Returns</p>
                  <p className="text-xs text-gray-600">Easy returns within 30 days</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over €60</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 text-center md:text-left">
            <Button onClick={handleRedirect} variant="default" size="lg" className="flex-1 sm:flex-initial">
              Continue Shopping
            </Button>
            <Button 
              onClick={() => router.push("/products")} 
              variant="outline" 
              size="lg"
              className="flex-1 sm:flex-initial"
            >
              Browse Products
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
