import { notFound } from "next/navigation";
import client from "@/sanity/lib/client";
import ProductDetails from "@/components/features/products/ProductDetails";
import RelatedProducts from "@/components/features/products/RelatedProducts";
import ReviewsSection from "@/components/features/products/ReviewsSection";
import { Product } from "@/lib/types/product";
import { Review } from "@/lib/types/review";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCT_BY_SLUG_QUERY, RELATED_PRODUCTS_QUERY, REVIEWS_BY_PRODUCT_QUERY } from "@/sanity/queries";

const getProduct = async (slug: string): Promise<Product | null> => {
  try {
    return await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, { slug });
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
    return await client.fetch<Product[]>(RELATED_PRODUCTS_QUERY, {
      categoryId,
      currentProductId,
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

const getReviews = async (productId: string): Promise<Review[]> => {
  try {
    const reviews = await client.fetch<Review[]>(REVIEWS_BY_PRODUCT_QUERY, { productId });
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

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews: Review[]): number | null => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;
    return Math.round(average * 10) / 10; // Round to 1 decimal place
  };

  const calculatedRating = calculateAverageRating(reviews);
  // Only use calculated rating from reviews, no manual rating
  const displayRating = calculatedRating;

  return (
    <>
      <ProductDetails
        product={{ ...product, rating: displayRating || undefined }}
        primaryImageUrl={primaryImageUrl}
        secondaryImageUrl={secondaryImageUrl}
        productId={product._id}
        reviewsCount={reviews.length}
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
