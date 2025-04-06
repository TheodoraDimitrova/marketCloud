"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import QuantitySelector from "@/components/shared/QuantitySelector";
import { useState, useEffect } from "react";
import TagsList from "@/components/shared/tags/listTags";
import Rating from "@/components/shared/Rating";
import DiscountBannerProduct from "@/components/shared/discountBannerProduct";
import { usePathname } from "next/navigation";
import { fetchProductDetails } from "@/store/slices/productsSlice";
import { urlFor } from "@/sanity/lib/image";
import Loading from "@/components/shared/Loading";
import { addToCart } from "@/store/slices/cartSlice";
import { Product } from "@/types/product";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const ProductPage = () => {
  const [hovered, setHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const { productDetails, status, error } = useAppSelector(
    (state) => state.products
  );

  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductDetails(slug as string));
    }
  }, [slug, dispatch]);

  const handleUpdateQuantity = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = (productDetails: Product) => {
    if (productDetails) {
      dispatch(addToCart({ ...productDetails, quantity }));
    }
  };

  return (
    <>
      {status === "loading" && <Loading />}
      {status === "failed" && <p className="text-red-500">Error: {error}</p>}
      {productDetails && (
        <div className="container mx-auto p-2 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* left side */}
          <div className="flex justify-center place-items-start p-4 md:p-0">
            <Image
              src={
                hovered
                  ? productDetails.images[1]
                    ? urlFor(productDetails.images[1])
                    : urlFor(productDetails.images[0])
                  : urlFor(productDetails.images[0])
              }
              alt={productDetails.name}
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
            <h1 className="text-xl m-0 ">{productDetails.name}</h1>
            <p className="text-sm font-light uppercase">
              {productDetails.description}
            </p>

            {productDetails.rating && <Rating rating={productDetails.rating} />}
            {productDetails.tags && productDetails.tags.length > 0 && (
              <TagsList tags={productDetails.tags} />
            )}

            <div className="flex justify-between my-6">
              <p>{productDetails.package || "No package info available"}</p>
              <p>€{Number(productDetails.price).toFixed(2)}</p>
            </div>

            {productDetails.discount?.isActive && (
              <DiscountBannerProduct
                price={productDetails.price}
                discount={productDetails.discount}
              />
            )}

            <div className="mt-6 flex items-center justify-around">
              <QuantitySelector
                quantity={quantity}
                updateQuantity={handleUpdateQuantity}
              />
              <Button
                onClick={() => {
                  handleAddToCart(productDetails);
                  setQuantity(1);
                }}
              >
                Add to Cart
              </Button>
            </div>

            <div className="mt-8">
              <h2 className="text-xl  text-gray-600">Product Details</h2>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-gray-700">
                {productDetails.productDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
