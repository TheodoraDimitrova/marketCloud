"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Tags } from "lucide-react";

const CartProductSummary = ({ item }) => {
  const pathname = usePathname();

  const isCheckoutPage = pathname === "/checkout";

  return (
    <div className="flex items-center w-full ">
      <div className="relative min-w-20 min-h-20">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50px, 100px"
          className="rounded-sm object-cover"
          priority
        />
        {/* Quantity Badge */}
        {isCheckoutPage && (
          <div className="absolute top-[-7px] right-[-6px] bg-red-500 text-white text-xs rounded-full px-2 py-1 ">
            {item.quantity}
          </div>
        )}
      </div>
      <div className="flex md:flex-1 ml-3 flex-col">
        <h3 className="text-sm font-medium">{item.name}</h3>
        <p className="text-sm">{item.description}</p>
        <p className="text-sm font-medium">Color: {item.color}</p>
        {isCheckoutPage &&
          item.discount?.isActive &&
          item.discount?.amount > 0 && (
            <div
              className="flex items-center mt-2 w-full bg-
             "
            >
              <Tags />
              <div className="text-sm w-full md:ml-2">
                -{item.discount.amount}{" "}
                {item.discount.type === "percentage" ? "%" : "€"} OFF
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CartProductSummary;
