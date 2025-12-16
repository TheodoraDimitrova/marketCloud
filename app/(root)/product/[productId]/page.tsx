import { notFound } from "next/navigation";
import client from "@/sanity/lib/client";
import ProductDetails from "@/components/features/products/ProductDetails";
import { Product } from "@/lib/types/product";
import { urlFor } from "@/sanity/lib/image";

const getProduct = async (slug: string): Promise<Product | null> => {
  try {
    const query = `*[_type == "product" && slug.current == $slug][0]`;
    const product = await client.fetch(query, { slug });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const primaryImageUrl = urlFor(product.images[0]);
  const secondaryImageUrl = product.images[1]
    ? urlFor(product.images[1])
    : primaryImageUrl;

  return (
    <ProductDetails
      product={product}
      primaryImageUrl={primaryImageUrl}
      secondaryImageUrl={secondaryImageUrl}
    />
  );
};

export default ProductPage;
