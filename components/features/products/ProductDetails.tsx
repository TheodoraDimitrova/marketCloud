"use client";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import QuantitySelector from "@/components/shared/common/QuantitySelector";
import { useState, useEffect } from "react";
import ListTags from "@/components/shared/tags/ListTags";
import Rating from "@/components/shared/common/Rating";
import DiscountBannerProduct from "@/components/features/products/DiscountBannerProduct";
import { urlFor } from "@/sanity/lib/image";
import { useProductCart } from "@/hooks/useProductCart";
import { Product } from "@/types/product";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import PriceDisplay from "@/components/shared/common/PriceDisplay";
import { setProductDetails } from "@/store/slices/productsSlice";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [hovered, setHovered] = useState(false);
  const dispatch = useAppDispatch();
  const { quantity, handleUpdateQuantity, handleAddToCart } =
    useProductCart(product);

  //save product details to redux store
  useEffect(() => {
    dispatch(setProductDetails(product));
  }, [product, dispatch]);

  return (
    <div className="container mx-auto p-2 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* left side */}
      <div className="flex justify-center place-items-start p-4 md:p-0">
        <Image
          src={
            hovered
              ? product.images[1]
                ? urlFor(product.images[1])
                : urlFor(product.images[0])
              : urlFor(product.images[0])
          }
          alt={product.name}
          width={200}
          height={250}
          style={{ width: "auto", height: "auto" }}
          sizes="(max-width: 768px) 100vw, (min-width: 1600px) 25wv, 100vw"
          className="rounded-[10px] shadow-lg h-[350px]"
          priority
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </div>

      {/* right side */}
      <div className="flex flex-col justify-start max-w-md p-2 md:p-6 ">
        <h1 className="text-xl m-0 ">{product.name}</h1>
        {product.brand && (
          <p className="text-sm font-medium text-gray-600 mt-1">
            Brand: {product.brand}
          </p>
        )}
        <p className="text-sm font-light uppercase">{product.description}</p>

        {product.rating && <Rating rating={product.rating} />}
        {product.tags && product.tags.length > 0 && (
          <ListTags tags={product.tags} />
        )}

        <div className="flex justify-between my-6">
          <p>{product.package || "No package info available"}</p>
          <PriceDisplay price={product.price} />
        </div>

        {product.discount?.isActive && (
          <DiscountBannerProduct
            price={product.price}
            discount={product.discount}
          />
        )}

        <div className="mt-6 flex items-center justify-around">
          <QuantitySelector
            quantity={quantity}
            updateQuantity={handleUpdateQuantity}
          />
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl  text-gray-600">Product Details</h2>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
            {product.productDetails.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
