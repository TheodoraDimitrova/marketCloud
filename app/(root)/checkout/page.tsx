import OrderSummary from "@/components/checkoutPage/OrderSummary";
import CheckoutForm from "@/components/checkoutPage/CheckoutForm";

const CheckoutPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 md:gap-4 my-10 md:my-24">
      <CheckoutForm />
      <OrderSummary />
    </div>
  );
};

export default CheckoutPage;
