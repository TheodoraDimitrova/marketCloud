import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  updateQuantity: (amount: number) => void;
}

const QuantitySelector = ({
  quantity,
  updateQuantity,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center justify-center border rounded border-gray-400 w-24 h-10 bg-white">
      <button
        type="button"
        onClick={() => updateQuantity(-1)}
        className="flex items-center justify-center w-8 h-full hover:bg-gray-100 transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={18} className="text-gray-700" />
      </button>

      <input
        type="number"
        value={quantity}
        readOnly
        className="w-12 text-center text-base font-medium text-gray-900 border-0 focus:outline-none"
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={() => updateQuantity(1)}
        className="flex items-center justify-center w-8 h-full hover:bg-gray-100 transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={18} className="text-gray-700" />
      </button>
    </div>
  );
};

export default QuantitySelector;
