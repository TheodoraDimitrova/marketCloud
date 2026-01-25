"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import { useParams } from "next/navigation";

import { CartItem } from "@/lib/types/cart";

interface CartProductSummaryProps { 
  item: CartItem;
}

const CartProductSummary = ({ item }: CartProductSummaryProps) => {
  const params = useParams();
  const pathname = usePathname();
  const orderId = params?.orderId;
  const isCheckoutPage = pathname === "/checkout";
  const isThankYouPage = pathname === `/checkout/thank-you/${orderId}`;

  return (
    <div className="flex items-center w-full ">
      <div className="relative min-w-20 min-h-20">
        <Image
          src={urlFor(item.images[0], { quality: 85, format: "webp" })}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50px, 100px"
          className="rounded-md object-cover"
          priority
        />
        {/* Quantity Badge */}
        {(isCheckoutPage || isThankYouPage) && (
          <div className="absolute top-[-7px] right-[-6px] bg-[#7d0d23] text-white text-xs rounded-full px-2 py-1 ">
            {item.quantity}
          </div>
        )}
      </div>
      <div className="flex md:flex-1 ml-3 flex-col">
        <h4>{item.name}</h4>

        {item.discount?.isActive && (
          <div className="flex items-center mt-2">
            <span className="text-xs font-medium text-[#7d0d23] bg-[#7d0d23]/10 px-2 py-0.5 rounded">
              -{item.discount.amount}
              {item.discount.type === "percentage" ? "%" : "€"} OFF
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartProductSummary;
