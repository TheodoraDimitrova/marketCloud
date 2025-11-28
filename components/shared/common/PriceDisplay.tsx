const PriceDisplay = ({ price }: { price: number }) => {
  return <span>€ {price.toFixed(2)}</span>;
};

export default PriceDisplay;
