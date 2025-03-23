const PaymentDetails = () => {
  const stripeEnabled = false;
  if (!stripeEnabled) {
    return <p>Payment system is not available at the moment.</p>;
  }

  return (
    <div>
      <p>Stripe Payment System will be here.</p>
    </div>
  );
};

export default PaymentDetails;
