import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { CartItem } from "@/types/cart";

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
          <p className="text-sm font-semibold line-through text-red-500">
            <PriceDisplay price={item.price} />
          </p>
        )}
        <p className="text-sm font-semibold">
          <PriceDisplay price={item.discountedPrice || item.price} />
        </p>
      </div>
    );
  }

  return (
    <p className={`text-sm font-semibold whitespace-nowrap ${className}`}>
      <PriceDisplay price={item.price} />
    </p>
  );
};

export default CartItemPrice;
