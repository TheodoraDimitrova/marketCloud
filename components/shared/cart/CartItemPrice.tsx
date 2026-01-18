import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { CartItem } from "@/lib/types/cart";

interface CartItemPriceProps {
  item: CartItem;
  className?: string;
  showStrikethrough?: boolean;
}

const CartItemPrice = ({
  item,
  className = "",
  showStrikethrough = true,
}: CartItemPriceProps) => {
  // Determine alignment based on className
  const isCentered =
    className.includes("text-center") || className.includes("justify-center");
  const alignmentClass = isCentered ? "items-center" : "items-end";

  if (item.discount?.isActive) {
    return (
      <div
        className={`flex flex-col ${alignmentClass} whitespace-nowrap ${className}`}
      >
        {showStrikethrough && (
          <p className="text-sm font-medium line-through decoration-2 text-gray-500">
            <PriceDisplay price={item.price} className="text-sm font-medium" />
          </p>
        )}
        <p className="text-base font-semibold text-gray-900">
          <PriceDisplay price={item.discountedPrice || item.price} className="text-base font-semibold" />
        </p>
      </div>
    );
  }

  return (
    <p className={`text-base font-semibold whitespace-nowrap ${className}`}>
      <PriceDisplay price={item.price} className="text-base font-semibold" />
    </p>
  );
};

export default CartItemPrice;
