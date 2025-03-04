import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const ProductPage = () => {
  const product = {
    name: "Lipstick Red Rose",
    description:
      "A beautiful red lipstick with a matte finish. Perfect for day and night wear. Long-lasting and vibrant color.",
    price: "25",
    image: "/images/img2.png",
    quantity: 1,
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
      <div className="flex flex-col justify-start">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-4 text-lg text-gray-600">{product.description}</p>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-2xl font-semibold text-gray-900">
            {product.price}
          </p>

          <div className="flex items-center">
            <Button>Add to Cart</Button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Product Details
          </h2>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
            <li>Long-lasting matte finish.</li>
            <li>Perfect for both day and night wear.</li>
            <li>Rich, pigmented color with full coverage.</li>
            <li>Hydrating formula that doesn't dry out lips.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
