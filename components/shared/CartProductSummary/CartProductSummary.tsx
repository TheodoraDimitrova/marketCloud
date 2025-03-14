"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Tags } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

const CartProductSummary = ({ item }) => {
  const pathname = usePathname();

  const isCheckoutPage = pathname === "/checkout";
  const isThankYouPage = pathname === "/checkout/thank-you";

  return (
    <div className="flex items-center w-full ">
      <div className="relative min-w-20 min-h-20">
        <Image
          src={urlFor(item.images[0])}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50px, 100px"
          className="rounded-sm object-cover"
          priority
        />
        {/* Quantity Badge */}
        {(isCheckoutPage || isThankYouPage) && (
          <div className="absolute top-[-7px] right-[-6px] bg-red-500 text-white text-xs rounded-full px-2 py-1 ">
            {item.quantity}
          </div>
        )}
      </div>
      <div className="flex md:flex-1 ml-3 flex-col">
        <h3 className="text-sm font-medium">{item.name}</h3>
        {/* <p className="text-sm">{item.description}</p> */}
        {item.color && (
          <p className="text-sm font-medium">Color: {item.color}</p>
        )}
        {item.size && <p className="text-sm font-medium">Size: {item.size}</p>}

        {item.discount && (
          <div className="flex items-center mt-2 w-full bg-">
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
