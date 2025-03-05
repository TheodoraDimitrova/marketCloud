"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import QuantitySelector from "@/components/shared/quantitySelector/QuantitySelector";
import { useState } from "react";
import TagsList from "@/components/shared/tags/listTags";
import Rating from "@/components/shared/raiting/raiting";
import DiscountBannerProduct from "@/components/shared/discountBannerProduct/discountBannerProduct";
import { calculateDiscountedPrice } from "@/lib/calculateCheckout";

const product = {
  name: "Lipstick Red Rose",
  description: "lipstick with matte finish",
  price: 25,
  image: "/images/img2.png",
  quantity: 12,
  package: "30ml",
  sizes: ["30 ml", "50 ml", "75 ml"],
  colors: ["Red", "Pink", "Nude"],
  rating: 4.5,
  reviews: 12,
  category: "lipsticks",
  brand: "Lipstick",
  sku: "LIPSTICK-RED-ROSE",
  stock: 10,
  id: "1",
  sku: "TOA01836",
  tags: [
    { type: "discount", label: "15% off" },
    // { type: "fixed", label: "10€ off" },
    // { type: "new", label: "New Arrival" },
    // { type: "limited", label: "Limited Edition" },
  ],
  discount: {
    amount: 15,
    type: "percentage", //fixed
    isActive: true,
  },
};

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const handleUpdateQuantity = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* left side */}
      <div className="flex justify-center items-center">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={400}
          style={{ width: "auto", height: "auto" }}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* right side */}
      <div className="flex flex-col justify-start max-w-md p-6 ">
        <h1 className="text-xl m-0  font-extralight">{product.name}</h1>
        <p className="text-sm font-sans uppercase">{product.description}</p>

        <Rating rating={product.rating} />
        <TagsList tags={product.tags} />

        <div className="flex justify-between my-6">
          <p className="">{product.package}</p>
          <p className="">€{Number(product.price).toFixed(2)}</p>
        </div>
        {product.discount.isActive && (
          <DiscountBannerProduct
            price={product.price}
            discount={product.discount}
          />
        )}

        <div className="mt-6 flex  items-center justify-around">
          <QuantitySelector
            quantity={quantity}
            updateQuantity={handleUpdateQuantity}
          />
          <Button>Add to Cart</Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Product Details
          </h2>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
            <li>Long-lasting matte finish.</li>
            <li>Perfect for both day and night wear.</li>
            <li>Rich, pigmented color with full coverage.</li>
            <li>Hydrating formula that doesn&apos;t dry out lips.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
