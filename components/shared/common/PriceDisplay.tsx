const PriceDisplay = ({ price, className = "" }: { price: number; className?: string }) => {
  return (
    <span className={`text-2xl font-bold text-gray-900 ${className}`}>
      € {price.toFixed(2)}
    </span>
  );
};

export default PriceDisplay;
