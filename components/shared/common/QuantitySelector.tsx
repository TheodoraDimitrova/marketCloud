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
    <div className="flex-center border rounded-sm border-gray-300 w-24 bg-gray-200 mt-2 ">
      <div>
        {" "}
        <Minus size={20} onClick={() => updateQuantity(-1)} />
      </div>

      <input
        type="number"
        value={quantity}
        readOnly
        className="w-12 text-center "
        aria-label="Quantity"
      />

      <div>
        {" "}
        <Plus size={20} onClick={() => updateQuantity(1)} />
      </div>
    </div>
  );
};

export default QuantitySelector;
