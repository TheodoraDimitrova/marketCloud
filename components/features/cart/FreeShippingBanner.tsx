import { Progress } from "@/components/ui/Progress";

interface FreeShippingBannerProps {
  totalAmount: number;
}

const FreeShippingBanner: React.FC<FreeShippingBannerProps> = ({
  totalAmount,
}) => {
  const freeShippingThreshold = 60;
  const progress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);

  return (
    <div className="text-center my-12">
      <p className="text-sm">
        {totalAmount >= freeShippingThreshold
          ? "You qualify for free shipping! 🎉"
          : `Spend €${(freeShippingThreshold - totalAmount).toFixed(
              2
            )} more for free shipping!`}
      </p>
      <Progress value={progress} className="w-full mt-2 h-2" />
    </div>
  );
};

export default FreeShippingBanner;
