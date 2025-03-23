import OrderSummary from "@/components/CheckoutPage/OrderSummary";
import CheckoutForm from "@/components/CheckoutPage/CheckoutForm";

const CheckoutPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-10 md:my-24">
      <CheckoutForm />
      <OrderSummary />
    </div>
  );
};

export default CheckoutPage;
