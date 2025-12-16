import { Progress } from "@/components/ui/Progress";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

interface FreeShippingBannerProps {
  totalAmount: number;
}

const FreeShippingBanner = ({ totalAmount }: FreeShippingBannerProps) => {
  const progress = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div className="text-center my-12">
      <p className="text-sm">
        {totalAmount >= FREE_SHIPPING_THRESHOLD ? (
          "You qualify for free shipping! 🎉"
        ) : (
          <>
            Spend <PriceDisplay price={FREE_SHIPPING_THRESHOLD - totalAmount} />{" "}
            more for free shipping!
          </>
        )}
      </p>
      <Progress value={progress} className="w-full mt-2 h-2" />
    </div>
  );
};

export default FreeShippingBanner;
