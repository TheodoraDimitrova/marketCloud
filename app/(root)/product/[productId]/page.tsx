import { notFound } from "next/navigation";
import client from "@/sanity/lib/client";
import ProductDetails from "@/components/features/products/ProductDetails";
import RelatedProducts from "@/components/features/products/RelatedProducts";
import ReviewsSection from "@/components/features/products/ReviewsSection";
import { Product } from "@/lib/types/product";
import { Review } from "@/lib/types/review";
import { urlFor } from "@/sanity/lib/image";

const getProduct = async (slug: string): Promise<Product | null> => {
  try {
    const query = `*[_type == "product" && slug.current == $slug][0]{
      ...,
      category->{
        _id,
        name,
        slug
      }
    }`;
    const product = await client.fetch(query, { slug });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

const getRelatedProducts = async (
  categoryId: string | undefined,
  currentProductId: string
): Promise<Product[]> => {
  if (!categoryId) {
    return [];
  }

  try {
    const query = `*[_type == "product" && references($categoryId) && _id != $currentProductId][0...3]{
      ...,
      _createdAt,
      _updatedAt
    }`;
    const products = await client.fetch(query, {
      categoryId,
      currentProductId,
    });

    return products;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

const getReviews = async (productId: string): Promise<Review[]> => {
  try {
    const query = `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
      _id,
      author,
      rating,
      comment,
      product,
      _createdAt,
      _updatedAt
    }`;
    const reviews = await client.fetch(query, { productId });
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
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

  // Get category ID - use _id if category is expanded, otherwise use _ref
  const categoryId = product.category?._id || product.category?._ref;
  
  const relatedProducts = await getRelatedProducts(
    categoryId,
    product._id
  );

  const reviews = await getReviews(product._id);

  return (
    <>
      <ProductDetails
        product={product}
        primaryImageUrl={primaryImageUrl}
        secondaryImageUrl={secondaryImageUrl}
      />
      <ReviewsSection reviews={reviews} productId={product._id} />
      {relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          currentProductId={product._id}
        />
      )}
    </>
  );
};

export default ProductPage;
