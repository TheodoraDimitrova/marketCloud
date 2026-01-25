"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/lib/types/product";

interface RelatedProductsProps {
  products: Product[];
  currentProductId: string;
}

const RelatedProducts = ({
  products,
  currentProductId,
}: RelatedProductsProps) => {
  // Filter out current product and limit to 4
  const relatedProducts = products
    .filter((product) => product._id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-8 mb-10">
      <h2 className="mb-6">You May Also Like</h2>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
